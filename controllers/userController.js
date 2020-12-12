const mongoose = require('mongoose');
const {promisify} = require('util');
const {
  body,
  validationResult,
  sanitizeBody,
  check,
} = require('express-validator');
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

exports.sanitizeEmail = body('email')
  .notEmpty()
  .withMessage('You must supply an email')
  .isEmail()
  .withMessage('Email has to have correct format!')
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
  });

exports.sanitizeName = body('name')
  .notEmpty()
  .withMessage('You must supply a name')
  .trim()
  .escape();

exports.sanitizePassword = body('password')
  .notEmpty()
  .withMessage('Password cannot be empty!');

exports.confirmPassword = body('passwordConfirm')
  .notEmpty()
  .withMessage('Confirm password cannot be empty!')
  .custom((val, { req }) => {
    if (val !== req.body.password) {
      throw new Error('Passwords must match!');
    }

    return true;
  });

exports.flashErrors = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    req.flash(
      'error',
      errors
        .array()
        .map((err) => err.msg)
        .join(', ')
    );
    res.render('signup', {
      title: 'Sign Up',
      body: req.body,
      flashes: req.flash(),
    });
  } else {
    next();
  }
};

exports.signup = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = new User({ email, name });
  const register = promisify(User.register).bind(User);
  await register(user, password);

  next();
};

