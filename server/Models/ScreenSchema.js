const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seat_id: String,
  row: Number,
  col: Number,
  price: Number,
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  screenType: {
    type: String, // Example: "Standard", "IMAX", "VIP", etc.
    required: true,
  },
  seats: {
    type: [[seatSchema]], // 2D array of seat objects
    required: true,
  },
  movieSchedules: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie", // Reference to the Movie model
        required: true,
      },
      showTime: String,
      notAvailableSeats: [
        {
          row: Number,
          col: Number,
          seat_id: String,
        },
      ],
      showDate: Date,
    },
  ],
});

const Screen = mongoose.model("Screen", screenSchema);

module.exports = Screen;
