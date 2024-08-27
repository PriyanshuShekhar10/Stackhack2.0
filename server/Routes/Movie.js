const express = require("express");
const router = express.Router();

const User = require("../Models/UserSchema");
const Movie = require("../Models/MovieSchema");
const Booking = require("../Models/BookingSchema");
const Screen = require("../Models/ScreenSchema");

const errorHandler = require("../Middlewares/errorMiddleware");
const authTokenHandler = require("../Middlewares/checkAuthToken");
const adminTokenHandler = require("../Middlewares/checkAdminToken");

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

// Constant for the city since there is only one city
const CITY_NAME = "Delhi"; // Replace "yourcity" with the actual city name in lowercase

router.get("/test", async (req, res) => {
  res.json({
    message: "Movie API is working",
  });
});

// Admin access: Create a new movie
router.post("/createmovie", adminTokenHandler, async (req, res, next) => {
  try {
    const {
      title,
      description,
      portraitImgUrl,
      landscapeImgUrl,
      rating,
      genre,
      duration,
      trailer,
      screenId,
    } = req.body;

    // Check if the screen exists
    const screen = await Screen.findById(screenId);
    if (!screen) {
      return res.status(404).json({
        ok: false,
        message: "Screen not found. Please add screens first.",
      });
    }

    const newMovie = new Movie({
      title,
      description,
      portraitImgUrl,
      landscapeImgUrl,
      rating,
      genre,
      duration,
      trailer,
    });

    await newMovie.save();

    res.status(201).json({
      ok: true,
      message: "Movie added successfully",
      data: newMovie,
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Admin access: Update a movie
router.put("/movies/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const updateData = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateData, {
      new: true,
    });
    if (!updatedMovie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (err) {
    next(err);
  }
});

// Admin access: Delete a movie
router.delete("/movies/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    if (!deletedMovie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Movie deleted successfully",
      data: deletedMovie,
    });
  } catch (err) {
    next(err);
  }
});

// Admin access: Add a celebrity to a movie
router.post("/addcelebtomovie", adminTokenHandler, async (req, res, next) => {
  try {
    const { movieId, celebType, celebName, celebRole, celebImage } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }
    const newCeleb = {
      celebType,
      celebName,
      celebRole,
      celebImage,
    };
    if (celebType === "cast") {
      movie.cast.push(newCeleb);
    } else {
      movie.crew.push(newCeleb);
    }
    await movie.save();

    res.status(201).json({
      ok: true,
      message: "Celeb added successfully",
      data: movie,
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Admin access: Create a new screen
router.post("/createscreen", adminTokenHandler, async (req, res, next) => {
  try {
    const { name, location, seats, screenType } = req.body;
    const newScreen = new Screen({
      name,
      location,
      seats,
      city: CITY_NAME,
      screenType,
      movieSchedules: [],
    });

    await newScreen.save();

    res.status(201).json({
      ok: true,
      message: "Screen added successfully",
      data: newScreen,
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Admin access: Add a movie schedule to a screen
router.post(
  "/addmoviescheduletoscreen",
  adminTokenHandler,
  async (req, res, next) => {
    try {
      const { screenId, movieId, showTime, showDate } = req.body;
      const screen = await Screen.findById(screenId);
      if (!screen) {
        return res.status(404).json({
          ok: false,
          message: "Screen not found",
        });
      }

      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({
          ok: false,
          message: "Movie not found",
        });
      }

      screen.movieSchedules.push({
        movieId,
        showTime,
        notavailableseats: [],
        showDate,
      });

      await screen.save();

      res.status(201).json({
        ok: true,
        message: "Movie schedule added successfully",
      });
    } catch (err) {
      next(err); // Pass any errors to the error handling middleware
    }
  }
);

// User access: Book a ticket
router.post("/bookticket", authTokenHandler, async (req, res, next) => {
  try {
    const {
      showTime,
      showDate,
      movieId,
      screenId,
      seats,
      totalPrice,
      paymentId,
      paymentType,
    } = req.body;

    const screen = await Screen.findById(screenId);
    if (!screen) {
      return res.status(404).json({
        ok: false,
        message: "Theatre not found",
      });
    }

    const movieSchedule = screen.movieSchedules.find((schedule) => {
      let showDate1 = new Date(schedule.showDate);
      let showDate2 = new Date(showDate);
      return (
        showDate1.getDay() === showDate2.getDay() &&
        showDate1.getMonth() === showDate2.getMonth() &&
        showDate1.getFullYear() === showDate2.getFullYear() &&
        schedule.showTime === showTime &&
        schedule.movieId == movieId
      );
    });

    if (!movieSchedule) {
      return res.status(404).json({
        ok: false,
        message: "Movie schedule not found",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    const newBooking = new Booking({
      userId: req.userId,
      showTime,
      showDate,
      movieId,
      screenId,
      seats,
      totalPrice,
      paymentId,
      paymentType,
    });
    await newBooking.save();

    movieSchedule.notAvailableSeats.push(...seats);
    await screen.save();

    user.bookings.push(newBooking._id);
    await user.save();

    res.status(201).json({
      ok: true,
      message: "Booking successful",
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Get all movies
router.get("/movies", async (req, res, next) => {
  try {
    const movies = await Movie.find();

    res.status(200).json({
      ok: true,
      data: movies,
      message: "Movies retrieved successfully",
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Get a movie by ID
router.get("/movies/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      ok: true,
      data: movie,
      message: "Movie retrieved successfully",
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Get all screens
router.get("/screens", async (req, res, next) => {
  try {
    const screens = await Screen.find({ city: CITY_NAME });
    if (!screens || screens.length === 0) {
      return res
        .status(404)
        .json(createResponse(false, "No screens found", null));
    }

    res
      .status(200)
      .json(createResponse(true, "Screens retrieved successfully", screens));
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware);
  }
});

// Get screens by movie schedule
router.get("/screensbymovieschedule/:date/:movieid", async (req, res, next) => {
  try {
    const date = req.params.date;
    const movieId = req.params.movieid;

    const screens = await Screen.find({ city: CITY_NAME });

    if (!screens || screens.length === 0) {
      return res
        .status(404)
        .json(createResponse(false, "No screens found", null));
    }

    let filteredScreens = [];
    screens.forEach((screen) => {
      screen.movieSchedules.forEach((schedule) => {
        let showDate = new Date(schedule.showDate);
        let bodyDate = new Date(date);
        if (
          showDate.getDay() === bodyDate.getDay() &&
          showDate.getMonth() === bodyDate.getMonth() &&
          showDate.getFullYear() === bodyDate.getFullYear() &&
          schedule.movieId == movieId
        ) {
          filteredScreens.push(screen);
        }
      });
    });

    res
      .status(200)
      .json(
        createResponse(true, "Screens retrieved successfully", filteredScreens)
      );
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware);
  }
});

// Get movie schedule by screen, date, and movie ID
router.get(
  "/schedulebymovie/:screenid/:date/:movieid",
  async (req, res, next) => {
    const screenId = req.params.screenid;
    const date = req.params.date;
    const movieId = req.params.movieid;

    try {
      const screen = await Screen.findById(screenId);
      if (!screen) {
        return res
          .status(404)
          .json(createResponse(false, "Screen not found", null));
      }

      const movieSchedules = screen.movieSchedules.filter((schedule) => {
        let showDate = new Date(schedule.showDate);
        let bodyDate = new Date(date);
        return (
          showDate.getDay() === bodyDate.getDay() &&
          showDate.getMonth() === bodyDate.getMonth() &&
          showDate.getFullYear() === bodyDate.getFullYear() &&
          schedule.movieId == movieId
        );
      });

      if (!movieSchedules.length) {
        return res
          .status(404)
          .json(createResponse(false, "Movie schedule not found", null));
      }

      res.status(200).json(
        createResponse(true, "Movie schedule retrieved successfully", {
          screen,
          movieSchedulesforDate: movieSchedules,
        })
      );
    } catch (err) {
      next(err); // Pass any errors to the error handling middleware);
    }
  }
);

// Get user bookings
router.get("/getuserbookings", authTokenHandler, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("bookings");
    if (!user) {
      return res
        .status(404)
        .json(createResponse(false, "User not found", null));
    }

    let bookings = [];
    for (let i = 0; i < user.bookings.length; i++) {
      let bookingobj = await Booking.findById(user.bookings[i]._id);
      bookings.push(bookingobj);
    }

    res
      .status(200)
      .json(
        createResponse(true, "User bookings retrieved successfully", bookings)
      );
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware);
  }
});

// Get a specific booking by ID
router.get("/getuserbookings/:id", authTokenHandler, async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json(createResponse(false, "Booking not found", null));
    }

    res
      .status(200)
      .json(createResponse(true, "Booking retrieved successfully", booking));
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware);
  }
});

router.use(errorHandler);

module.exports = router;
