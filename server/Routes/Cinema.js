const express = require("express");
const router = express.Router();
const Cinema = require("../Models/CinemaSchema");
const Screen = require("../Models/ScreenSchema");
const adminTokenHandler = require("../Middlewares/checkAdminToken");

router.post("/createcinema", adminTokenHandler, async (req, res, next) => {
  try {
    const { name, address, city, contactNumber, screens } = req.body;

    const newCinema = new Cinema({
      name,
      address,
      city,
      contactNumber,
    });

    const savedCinema = await newCinema.save();

    // Create screens for the cinema
    const savedScreens = await Promise.all(
      screens.map(async (screen) => {
        const newScreen = new Screen({
          name: screen.name,
          location: screen.location,
          seats: screen.seats,
          city: city, // Use the same city as the cinema
          screenType: screen.screenType,
          cinema: savedCinema._id,
        });
        return await newScreen.save();
      })
    );

    // Add the screens to the cinema
    savedCinema.screens = savedScreens.map((screen) => screen._id);
    await savedCinema.save();

    res.status(201).json({
      ok: true,
      message: "Cinema and screens created successfully",
      data: savedCinema,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
