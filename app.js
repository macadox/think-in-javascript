const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash')
const morgan = require('morgan');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const viewRoutes = require('./routes');
const postsRoutes = require('./routes/postRoutes');
const helpers = require('./helpers');
const { globalErrorHandler, AppError } = require('./handlers/errorHandler');

const User = mongoose.model('User')

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: true}))
// app.use(bodyParser.json({ limit: '5mb' }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);


app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
    res.locals.h = helpers
    res.locals.flashes = req.flash();
    res.locals.user= req.user || null;

    next()
})

// Routes
app.use('/', viewRoutes);
app.use('/api/v1/posts', postsRoutes);
// app.use('/api/v1/tags')
// app.use('/api/v1/admin')

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
