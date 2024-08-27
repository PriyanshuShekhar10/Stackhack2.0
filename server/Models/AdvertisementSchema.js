const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  AdvertUrl: {
    type: String,
    required: true,
  },
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
