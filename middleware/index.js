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
        if (founditem.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Sorry only the owner has access to this feature");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

const isLoggedIn = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect("back");
};
