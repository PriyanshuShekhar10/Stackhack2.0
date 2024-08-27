const express = require("express");
const router = express.Router();
const Admin = require("../Models/AdminSchema"); // Import the Admin model
const User = require("../Models/UserSchema"); // Import the Admin model

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../Middlewares/errorMiddleware");
const adminTokenHandler = require("../Middlewares/checkAdminToken");
const Ad = require("../Models/AdSchema"); // Import the Ad schema

function createResponse(ok, message, data = {}) {
  return { ok, message, data };
}

// Register a new admin
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json(createResponse(false, "Admin with this email already exists"));
    }

    // Hash the admin's password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save(); // Await the save operation

    res.status(201).json(createResponse(true, "Admin registered successfully"));
  } catch (err) {
    next(err);
  }
});

// Get all admins (Admin only)
router.get("/admins", adminTokenHandler, async (req, res, next) => {
  try {
    const admins = await Admin.find().select("-password"); // Exclude password
    res
      .status(200)
      .json(createResponse(true, "Admins retrieved successfully", admins));
  } catch (err) {
    next(err);
  }
});

// Update an admin (Admin only)
router.put("/admins/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const adminId = req.params.id;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json(createResponse(false, "Admin not found"));
    }

    res
      .status(200)
      .json(createResponse(true, "Admin updated successfully", updatedAdmin));
  } catch (err) {
    next(err);
  }
});

// Delete an admin (Admin only)
router.delete("/admins/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json(createResponse(false, "Admin not found"));
    }

    res.status(200).json(createResponse(true, "Admin deleted successfully"));
  } catch (err) {
    next(err);
  }
});

// Add other routes for normal users (GET, PUT, DELETE)
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res
      .status(200)
      .json(createResponse(true, "Users retrieved successfully", users));
  } catch (err) {
    next(err);
  }
});

router.put("/users/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    res
      .status(200)
      .json(createResponse(true, "User updated successfully", updatedUser));
  } catch (err) {
    next(err);
  }
});

router.delete("/users/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    res.status(200).json(createResponse(true, "User deleted successfully"));
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// Admin login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid admin credentials"));
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid admin credentials"));
    }

    // Generate an authentication token for the admin
    const adminAuthToken = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_ADMIN_SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Set the authentication token in a cookie
    res.cookie("adminAuthToken", adminAuthToken, {
      httpOnly: false,
      path: "/",
      secure: true, // Set to true if you're using HTTPS
      sameSite: "strict", // Can be set to 'lax' or 'strict' for better CSRF protection
    });

    res
      .status(200)
      .json(createResponse(true, "Admin login successful", { adminAuthToken }));
  } catch (err) {
    next(err);
  }
});

// Check login status
router.get("/checklogin", adminTokenHandler, async (req, res) => {
  res.json(createResponse(true, "Admin authenticated successfully"));
});

// Admin logout
router.get("/logout", adminTokenHandler, async (req, res) => {
  res.clearCookie("adminAuthToken", {
    path: "/",
    httpOnly: false,
  });

  res.json(createResponse(true, "Admin logged out successfully"));
});

// Create a new advertisement (Admin only)
router.post("/ads", adminTokenHandler, async (req, res, next) => {
  try {
    const { adUrl } = req.body;

    const newAd = new Ad({ adUrl });
    await newAd.save();

    res.status(201).json({
      ok: true,
      message: "Advertisement created successfully",
      data: newAd,
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Get all advertisements
router.get("/ads", async (req, res, next) => {
  try {
    const ads = await Ad.find();
    res.status(200).json({
      ok: true,
      data: ads,
      message: "Advertisements retrieved successfully",
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Update an advertisement (Admin only)
router.put("/ads/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const adId = req.params.id;
    const { adUrl } = req.body;

    const updatedAd = await Ad.findByIdAndUpdate(
      adId,
      { adUrl },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({
        ok: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Advertisement updated successfully",
      data: updatedAd,
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Delete an advertisement (Admin only)
router.delete("/ads/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const adId = req.params.id;

    const deletedAd = await Ad.findByIdAndDelete(adId);

    if (!deletedAd) {
      return res.status(404).json({
        ok: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Advertisement deleted successfully",
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

module.exports = router;

// Use error handling middleware for any unhandled errors
router.use(errorHandler);

module.exports = router;
