const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    screens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen", // Reference to the Screen model
        required: true,
      },
    ],
    contactNumber: {
      type: String,
      required: true,
    },
    facilities: {
      type: [String], // Example: ['Parking', 'Wheelchair Accessible', 'Food Court']
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cinema = mongoose.model("Cinema", cinemaSchema);

module.exports = Cinema;
