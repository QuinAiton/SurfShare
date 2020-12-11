const express = require("express"),
  router = express.Router(),
  Item = require("../models/Item"),
  Comment = require("../models/Comment"),
  middleware = require("../middleware");

router.get("/gallery", (req, res) => {
  Item.find({}, (err, items) => {
    err
      ? console.log(err)
      : res.render("items/gallery", { items: items, currentUser: req.user });
  });
});

//add item to Gallery
//========================================================================
router.get("/gallery/addItem", middleware.isLoggedIn, (req, res) => {
  res.render("items/addItem");
});

router.post("/gallery", middleware.isLoggedIn, (req, res) => {
  // req.body.Item.body = req.sanitize(req.body.Item.body);
  const item = new Item(req.body.item);
  item.owner.id = req.user._id;
  item.owner.username = req.user.username;
  Item.create(item, (err, newlyCreated) => {
    Item.owner = req.user._id;
    err ? console.log(err) : res.redirect("/gallery");
  });
});
//=====================================================================

//show route
//======================================================================
router.get("/gallery/:id", (req, res) => {
  Item.findById(req.params.id)
    .populate("comments")
    .exec((err, foundItem) => {
      err ? console.log(err) : res.render("items/show", { item: foundItem });
    });
});
//======================================================================

// edit route
//===================================================
router.get("/gallery/:id/edit", middleware.checkItemOwnership, (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    res.render("items/edit", { item: foundItem });
  });
});

router.put("/gallery/:id", middleware.checkItemOwnership, (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body.item, (err, updateditem) => {
    err ? console.log(err) : res.redirect("/gallery/" + updateditem._id);
  })
});

//delete route
//====================================================
router.delete("/gallery/:id", middleware.checkItemOwnership, (req, res) => {
  Item.findByIdAndDelete(req.params.id, (err) => {
    err ? console.log(err) : res.redirect("/gallery");
  })
})

module.exports = router;
