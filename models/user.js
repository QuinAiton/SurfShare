const mongoose = require("mongoose"),
  mongooseLocal = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  email: String,
});

userSchema.plugin(mongooseLocal);

module.exports = mongoose.model("User", userSchema);
