const mongoose = require("mongoose");
//   mongooseLocal = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// userSchema.plugin(mongooseLocal);

module.exports = mongoose.model("User", userSchema);
