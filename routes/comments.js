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

router.post("/gallery/:id", middleware, (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
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
