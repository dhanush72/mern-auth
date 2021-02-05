const mongoose = require("mongoose");

const Customer = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("customer", Customer);
