const crypto = require('crypto');
const mongoose = require('mongoose');
const { promisify } = require('util');
const passport = require('passport');
const User = mongoose.model('User');
const { AppError } = require('./../handlers/errorHandler');
const Email = require('./../handlers/Email');

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
    return next();
  }
  req.flash(
    'error',
    'You do not have enough permission power to view that page, please contact the administrator'
  );
  res.redirect('/');
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    req.flash('error', 'Account with that email does not exist.');
    return res.redirect('/login');
  }

  const token = await user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/reset/${token}`;

  try {
    await new Email(
      {
        name: user.name,
        to: user.username,
        from: `Think in JS <${process.env.EMAIL_FROM}>`,
      },
      resetUrl
    ).sendPasswordReset();

    req.flash('success', 'Email has been sent. Check your mailbox :)');
    return res.redirect('/login');
  } catch (e) {
    console.log(e);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error while sending the email', 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  const encodedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: encodedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('Token has expired, reset the password once again', 404)
    );
  }

  const setPassword = promisify(user.setPassword).bind(user);
  await setPassword(req.body.password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  req.flash('success', 'Password has been reset!');
  return res.redirect('/login');
};
