const express = require("express");
const router = express.Router();
const Admin = require("../Models/AdminSchema"); // Import the Admin model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../Middlewares/errorMiddleware");
const adminTokenHandler = require("../Middlewares/checkAdminToken");
const Ad = require("../Models/AdvertisementSchema");

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
      { expiresIn: "10m" }
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

router.post("/ads", adminTokenHandler, async (req, res, next) => {
  try {
    const { AdvertUrl } = req.body;

    const newAd = new Ad({
      AdvertUrl,
    });
    await newAd.save();
    res.status(201).json({
      ok: true,
      message: "Ad added successfully",
    });
  } catch (err) {
    next(err);
  }
});

router.get("/ads", async (req, res) => {
  try {
    const ads = await Ad.find();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ads", error });
  }
});

router.delete("/ads/:id", adminTokenHandler, async (req, res) => {
  try {
    const adId = req.params.id;
    await Ad.findByIdAndDelete(adId);
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ad", error });
  }
});
module.exports = router;
