const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  expressSanitizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  middleware = require("./middleware/index");

//models
//=================================================
const Item = require("./models/Item"),
  User = require("./models/user");
//=================================================

//
mongoose
  .connect("mongodb://localhost:27017/SurfShareDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Your Database has been connected");
  })
  .catch((err) => {
    console.log("ERROR", err.message);
  });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

// ================================================================
// PASSPORT CONFIG
// ================================================================
app.use(
  require("express-session")({
    secret: "7427 Clover Road",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash message set up
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
//======================================================================

//All Routes
//=======================================================================
const isLoggedIn = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect("/login");
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/gallery", (req, res) => {
  console.log(req.user);
  Item.find({}, (err, items) => {
    err
      ? console.log(err)
      : res.render("gallery", { items: items, currentUser: req.user });
  });
});

//add item to Gallery
//========================================================================
app.get("/addItem", isLoggedIn, (req, res) => {
  res.render("AddItem");
});

app.post("/gallery", isLoggedIn, (req, res) => {
  const description = req.body.description,
    price = req.body.price,
    title = req.body.title,
    image = req.body.image,
    newItem = {
      title: title,
      image: image,
      price: price,
      description: description,
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

// edit route
//===================================================
app.get("/gallery/:id/edit", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    res.render("edit", { item: foundItem });
  });
});

app.put("/gallery/:id", (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body.item, (err, updateditem) => {
    err ? console.log(err) : res.redirect("/gallery" + item._id);
  });
});

//delete route
//====================================================
app.delete("/gallery/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id, (err) => {
    err ? console.log(err) : res.redirect("/gallery");
  });
});
//=====================================================================
//Authorization routes
//=====================================================================

//SignUp Routes
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  User.register(
    new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/signup");
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  );
});

//Login routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//logout routes
app.get("/logout", (req, res) => {
  req.flash("success", "Goodbye " + req.user.username + " logout successfull");
  req.logout();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("App Firing On Port 3000!");
});
