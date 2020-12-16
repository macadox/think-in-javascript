const mongoose = require('mongoose');
const {promisify} = require('util');

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

exports.signup = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = new User({ email, name });
  const register = promisify(User.register).bind(User);
  await register(user, password);

  next();
};

