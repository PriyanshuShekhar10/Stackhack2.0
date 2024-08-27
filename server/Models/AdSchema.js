const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  adUrl: {
    type: String,
    required: true,
  },
});

const ad = mongoose.model("ad", adSchema);

module.exports = ad;
