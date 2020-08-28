const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  expressSanitizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  app = express();

//modules
//=================================================
const Item = require("./modules/Item"),
  User = require("./modules/user");
const { insertMany } = require("./modules/Item");
//=================================================

//
mongoose.connect("mongodb://localhost:27017/SurfShareApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//All Routes
//===================================================
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/gallery", (req, res) => {
  Item.find({}, (err, items) => {
    err ? console.log(err) : res.render("gallery", { items: items });
  });
});

//add item route
//========================================================================
app.get("/addItem", (req, res) => {
  res.render("AddItem");
});

app.post("/gallery", (req, res) => {
  const body = req.body.body,
    price = req.body.price,
    title = req.body.title,
    image = req.body.image,
    newItem = {
      title: title,
      image: image,
      price: price,
      body: body,
    };

  // req.body.Item.body = req.sanitize(req.body.Item.body);
  Item.create(newItem, (err, newlyCreated) => {
    err ? console.log(err) : res.redirect("/gallery");
  });
});
//=====================================================================

//show route
//======================================================================
app.get("/gallery/:id", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    err ? console.log(err) : res.render("show", { item: foundItem });
  });
});
//======================================================================

//Blog Route
//====================================================
app.get("/forum", (req, res) => {
  res.render("forum");
});

// edit route (finish me!!!!1)
//===================================================
app.get("/gallery/:id/edit", (req, res) => {
  Item.findByIdAndUpdate(req.params.id),
    (err, foundItem) => {
      res.render("edit", { item: foundItem });
    };
});

//delete route
//====================================================
app.get("/gallery/:id/delete", (req, res) => {
  res.render("delete");
  Item.findByIdAndDelete(req.params.id, (err, itemRemoved) => {
    err ? console.log(err) : res.redirect("/gallery");
  });
});
//===================================================
//Authorization routes
//=====================================================================
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});
//======================================================================
app.listen(3000, () => {
  console.log("App Firing On Port 3000!");
});
