const express = require("express");
const router = express.Router();

const User = require("../Models/UserSchema");
const Movie = require("../Models/MovieSchema");
const Booking = require("../Models/BookingSchema");
const Screen = require("../Models/ScreenSchema");

const errorHandler = require("../Middlewares/errorMiddleware");
const authTokenHandler = require("../Middlewares/checkAuthToken");
const adminTokenHandler = require("../Middlewares/checkAdminToken");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

router.get("/test", async (req, res) => {
  res.json({
    message: "Movie api is working",
  });
});

// admin access
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
    } = req.body;

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
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

router.put("/movies/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, {
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
    next(err); // Pass any errors to the error handling middleware
  }
});

// Delete Movie (Admin Only)
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
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

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
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

router.post("/createscreen", adminTokenHandler, async (req, res, next) => {
  try {
    const { name, location, city, screenType } = req.body;

    // Default seat configuration (e.g., 10 rows with 10 seats each)
    const numberOfRows = 10;
    const seatsPerRow = 10;
    const seats = [];

    for (let row = 0; row < numberOfRows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        rowSeats.push({
          seat_id: `R${row + 1}C${col + 1}`,
          row: row + 1,
          col: col + 1,
          price: 100, // Default price
          isBooked: false,
        });
      }
      seats.push(rowSeats);
    }

    const newScreen = new Screen({
      name,
      location,
      city: city.toLowerCase(),
      screenType,
      seats, // Use the generated seats array
      movieSchedules: [], // Empty initially
    });

    await newScreen.save();

    res.status(201).json({
      ok: true,
      message: "Screen added successfully",
    });
  } catch (err) {
    console.log(err);
    next(err); // Pass any errors to the error handling middleware
  }
});

router.post(
  "/addmoviescheduletoscreen",
  adminTokenHandler,
  async (req, res, next) => {
    console.log("Inside addmoviescheduletoscreen");
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

// user access
// Booking a movie (User Access)

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

    // Validate the inputs
    if (
      !showTime ||
      !showDate ||
      !movieId ||
      !screenId ||
      !seats ||
      seats.length === 0 ||
      !totalPrice ||
      !paymentId ||
      !paymentType
    ) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields for booking.",
      });
    }

    // Validate movieId and screenId
    if (
      !mongoose.Types.ObjectId.isValid(movieId) ||
      !mongoose.Types.ObjectId.isValid(screenId)
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid Movie ID or Screen ID.",
      });
    }

    // Convert movieId and screenId to ObjectId
    const movieObjectId = new mongoose.Types.ObjectId(movieId);
    const screenObjectId = new mongoose.Types.ObjectId(screenId);

    // Check if the movie exists
    const movie = await Movie.findById(movieObjectId);
    if (!movie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found.",
      });
    }

    // Check if the screen exists
    const screen = await Screen.findById(screenObjectId);
    if (!screen) {
      return res.status(404).json({
        ok: false,
        message: "Screen not found.",
      });
    }

    // Find the movie schedule
    const movieSchedule = screen.movieSchedules.find(
      (schedule) =>
        schedule.movieId.equals(movieObjectId) &&
        new Date(schedule.showDate).toISOString() ===
          new Date(showDate).toISOString() &&
        schedule.showTime === showTime
    );

    // Check if the movie schedule exists
    if (!movieSchedule) {
      return res.status(404).json({
        ok: false,
        message: "Movie schedule not found.",
      });
    }

    // Ensure the selected seats are not already booked
    const seatConflict = seats.some((seat) =>
      movieSchedule.notAvailableSeats.some(
        (unavailableSeat) =>
          unavailableSeat.row === seat.row && unavailableSeat.col === seat.col
      )
    );

    if (seatConflict) {
      return res.status(400).json({
        ok: false,
        message: "One or more selected seats are already booked.",
      });
    }

    // Create a new booking
    const newBooking = new Booking({
      showTime,
      showDate,
      movieId: movieObjectId,
      screenId: screenObjectId,
      seats,
      totalPrice,
      paymentId,
      paymentType,
      userId: req.userId, // Retrieved from authTokenHandler
    });

    // Save the booking
    await newBooking.save();

    // Update the screen to mark seats as booked
    movieSchedule.notAvailableSeats.push(...seats);
    await screen.save();

    // Add the booking to the user's booking list
    await User.findByIdAndUpdate(req.userId, {
      $push: { bookings: newBooking._id },
    });

    res.status(201).json({
      ok: true,
      message: "Booking successful",
      data: newBooking,
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

router.get("/movies", async (req, res, next) => {
  try {
    const movies = await Movie.find();

    // Return the list of movies as JSON response
    res.status(200).json({
      ok: true,
      data: movies,
      message: "Movies retrieved successfully",
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

router.get("/movies/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      // If the movie is not found, return a 404 Not Found response
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
router.get("/screensbycity/:city", async (req, res, next) => {
  const city = req.params.city.toLowerCase();

  try {
    const screens = await Screen.find({ city });
    if (!screens || screens.length === 0) {
      return res
        .status(404)
        .json(
          createResponse(false, "No screens found in the specified city", null)
        );
    }

    res
      .status(200)
      .json(createResponse(true, "Screens retrieved successfully", screens));
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});
router.get(
  "/screensbymovieschedule/:city/:date/:movieid",
  async (req, res, next) => {
    try {
      const city = req.params.city.toLowerCase();
      const date = req.params.date;
      const movieId = req.params.movieid;

      // Retrieve screens for the specified city
      const screens = await Screen.find({ city });

      // Check if screens were found
      if (!screens || screens.length === 0) {
        return res
          .status(404)
          .json(
            createResponse(
              false,
              "No screens found in the specified city",
              null
            )
          );
      }

      // Filter screens based on the movieId
      // const filteredScreens = screens.filter(screen =>
      //     screen.movieSchedules.some(schedule => schedule.movieId == movieId)
      // );

      let temp = [];
      // Filter screens based on the showDate
      const filteredScreens = screens.forEach((screen) => {
        // screen

        screen.movieSchedules.forEach((schedule) => {
          let showDate = new Date(schedule.showDate);
          let bodyDate = new Date(date);
          // console.log(showDate , bodyDate);
          if (
            showDate.getDay() === bodyDate.getDay() &&
            showDate.getMonth() === bodyDate.getMonth() &&
            showDate.getFullYear() === bodyDate.getFullYear() &&
            schedule.movieId == movieId
          ) {
            temp.push(screen);
          }
        });
      });

      console.log(temp);

      res
        .status(200)
        .json(createResponse(true, "Screens retrieved successfully", temp));
    } catch (err) {
      next(err); // Pass any errors to the error handling middleware
    }
  }
);

router.get(
  "/schedulebymovie/:screenid/:date/:movieid",
  async (req, res, next) => {
    try {
      const screenId = req.params.screenid;
      const date = req.params.date;
      const movieId = req.params.movieid;

      // Find the screen by ID
      const screen = await Screen.findById(screenId);

      if (!screen) {
        return res
          .status(404)
          .json(createResponse(false, "Screen not found", null));
      }

      // Filter the movie schedules for the specific date and movie
      const movieSchedule = screen.movieSchedules.find((schedule) => {
        let showDate = new Date(schedule.showDate);
        let bodyDate = new Date(date);
        return (
          showDate.getDay() === bodyDate.getDay() &&
          showDate.getMonth() === bodyDate.getMonth() &&
          showDate.getFullYear() === bodyDate.getFullYear() &&
          schedule.movieId == movieId
        );
      });

      // If no matching schedule is found, return 404
      if (!movieSchedule) {
        return res
          .status(404)
          .json(createResponse(false, "Movie schedule not found", null));
      }

      // Return the screen, the matching movie schedule, and the notAvailableSeats
      res.status(200).json(
        createResponse(true, "Movie schedule retrieved successfully", {
          screen: {
            _id: screen._id,
            name: screen.name,
            location: screen.location,
            city: screen.city,
            screenType: screen.screenType,
          },
          movieSchedule: {
            _id: movieSchedule._id,
            showTime: movieSchedule.showTime,
            showDate: movieSchedule.showDate,
            notAvailableSeats: movieSchedule.notAvailableSeats,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

router.get("/getuserbookings", async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("bookings");
    if (!user) {
      return res
        .status(404)
        .json(createResponse(false, "User not found", null));
    }

    let bookings = [];
    // user.bookings.forEach(async booking => {
    //     let bookingobj = await Booking.findById(booking._id);
    //     bookings.push(bookingobj);
    // })

    for (let i = 0; i < user.bookings.length; i++) {
      let bookingobj = await Booking.findById(user.bookings[i]._id);
      bookings.push(bookingobj);
    }

    res
      .status(200)
      .json(
        createResponse(true, "User bookings retrieved successfully", bookings)
      );
    // res.status(200).json(createResponse(true, 'User bookings retrieved successfully', user.bookings));
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

router.get("/getuserbookings/:id", async (req, res, next) => {
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
    next(err); // Pass any errors to the error handling middleware
  }
});

// Update a booking (Admin only)
router.put("/bookings/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        ok: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

// Delete a booking (Admin only)
router.delete("/bookings/:id", adminTokenHandler, async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({
        ok: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
});

router.use(errorHandler);

module.exports = router;
