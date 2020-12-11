const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Item = require("../models/Item"),
  Comment = require("../models/Comment"),
  middleware = require("../middleware");

//comments route
router.get("/gallery/:id", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) =>
    err ? console.log(err) : res.render("items/show", { item: foundItem })
  );
});

router.post("/gallery/:id", middleware.isLoggedIn, (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    if (err) {
      console.log(err);
    } else {
      const comment = new Comment(req.body.comment);
      comment.owner.id = req.user._id;
      comment.owner.username = req.user.username;
      Comment.create(comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          foundItem.comments.push(comment);
          foundItem.save();
          res.redirect("/gallery/" + foundItem._id);
        }
      });
    }
  });
});

module.exports = router;
