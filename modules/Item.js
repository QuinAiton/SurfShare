const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  created: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
