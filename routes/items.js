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
router.get("/gallery/addItem", (req, res) => {
  res.render("items/AddItem");
});

router.post("/gallery", (req, res) => {
  // req.body.Item.body = req.sanitize(req.body.Item.body);
  Item.create(req.body.item, (err, newlyCreated) => {
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
router.get("/gallery/:id/edit", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    res.render("items/edit", { item: foundItem });
  });
});

router.put("/gallery/:id", (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body.item, (err, updateditem) => {
    err ? console.log(err) : res.redirect("/gallery" + item._id);
  });
});

//delete route
//====================================================
router.delete("/gallery/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id, (err) => {
    err ? console.log(err) : res.redirect("/gallery");
  });
});

module.exports = router;
