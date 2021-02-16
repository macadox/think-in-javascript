const mongoose = require('mongoose');

const { promisify } = require('util');
const Email = require('./../handlers/Email');

const User = mongoose.model('User');

exports.loginForm = (req, res) => {
  res.render('login', {
    title: 'Login',
  });
};

exports.signUpForm = (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
  });
};

exports.passwordResetForm = (req, res) => {
  res.render('passwordReset', {
    title: 'Password Reset',
    token: req.params.token,
  });
};

exports.signup = async (req, res, next) => {
  const { username, name, password } = req.body;
  const user = new User({ username, name });
  const register = promisify(User.register).bind(User);

  const registerPromise = register(user, password);
  const emailPromise = new Email({
    name: user.name,
    to: user.username,
    from: `Think in JS <${process.env.EMAIL_FROM}>`,
  }).sendWelcome();

  await Promise.all([registerPromise, emailPromise]);
  next();
};
