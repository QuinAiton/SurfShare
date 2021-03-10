require('dotenv').config();
const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  expressSanitizer = require('express-sanitizer'),
  methodOverride = require('method-override'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  flash = require('connect-flash'),
  middleware = require('./middleware/index'),
  Item = require('./models/Item'),
  User = require('./models/user'),
  Comment = require('./models/Comment');
//=================================================
// requiring Routes
const ItemRoutes = require('./routes/items'),
  CommentRoutes = require('./routes/comments'),
  IndexRoutes = require('./routes/index'),
  ForumRoutes = require('./routes/forum');

//
mongoose
  .connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Your Database has been connected');
  })
  .catch((err) => {
    console.log('ERROR', err.message);
  });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(flash());

// ================================================================
// PASSPORT CONFIG
app.use(
  require('express-session')({
    secret: 'Pemberton',
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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
//======================================================================
//imported routes
app.use(ItemRoutes);
app.use(CommentRoutes);
app.use(IndexRoutes);
app.use(ForumRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('App Firing On Port 3000!');
});
