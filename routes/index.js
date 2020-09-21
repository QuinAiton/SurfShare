const express = require("express"),
  passport = require("passport"),
  User = require("../models/user"),
  router = express.Router();

//=====================================================================
//Root Route
router.get("/", (req, res) => {
  res.render("items/index");
});
//=====================================================================

//=====================================================================
//Authorization routes
//SignUp Routes
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  User.register(new User(req.body.newUser), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/signup");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/");
    });
  });
});

//Login routes
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//logout routes
router.get("/logout", (req, res) => {
  req.flash("success", "Goodbye " + req.user.username + " logout successfull");
  req.logout();
  res.redirect("/");
});

//=====================================================================

module.exports = router;
