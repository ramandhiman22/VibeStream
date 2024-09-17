const createError = require('http-errors');
const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const localStrategy = require('./middlewares/local.strategy');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRoutes = require('./routes/user');
const docRouter = require('./routes/doc');
const trackRoutes = require('./routes/Track');
const artistRoutes = require('./routes/artist');
const playListRoutes = require('./routes/playlist');
const AlbumRoutes = require('./routes/album');
const GenreRoutes = require('./routes/genre');
const AdminRoutes = require('./routes/admin');
const DownloadRoutes=require('./routes/download')
const PremiumRoutes = require('./routes/PremiumRoutes');
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Ensure this is set up

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);

app.use('/', indexRouter);
app.use('/user', userRoutes);
app.use('/auth', authRouter);
app.use('/doc', docRouter);
app.use('/track', trackRoutes);
app.use('/artist', artistRoutes);
app.use('/playlist', playListRoutes);
app.use('/album', AlbumRoutes);
app.use('/genre', GenreRoutes);
app.use('/admin', AdminRoutes);
app.use('/download',DownloadRoutes);
app.use('/Premium', PremiumRoutes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
