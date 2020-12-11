const middlewareObj = [],
  Item = require("../models/Item"),
  User = require("../models/user");

middlewareObj.checkItemOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Item.findById(req.params.id, (err, founditem) => {
      if (err || !founditem) {
        req.flash(error, "Sorry no such item exists");
        res.redirect("back");
      } else {
        if (founditem.owner.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Sorry only the Owner can access these features.");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "Sorry You must be logged in to use this feature.");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
