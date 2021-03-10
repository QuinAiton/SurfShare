const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  price: String,
  created: { type: Date, default: Date.now },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});
module.exports = mongoose.model("Item", itemSchema);
