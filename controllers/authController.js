const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'User logged in',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'User logged out');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in!');
  res.redirect('/login');
};

exports.hasPermissionPower = (val) => (req, res, next) => {
  if (req.user.permissionPower >= val) {
      return next()
  }
  req.flash('error', 'You do not have enough permission power to view that page, please contact the administrator');
  res.redirect('/')
};
