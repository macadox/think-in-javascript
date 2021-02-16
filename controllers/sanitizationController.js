const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Config = mongoose.model('Config');

exports.sanitizeEmail = body('username')
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
  .withMessage('Password cannot be empty!')
  .isLength({ min: 8 })
  .withMessage('Password must be minimum 8 characters long!');

exports.confirmPassword = body('passwordConfirm')
  .notEmpty()
  .withMessage('Confirm password cannot be empty!')
  .custom((val, { req }) => {
    if (val !== req.body.password) {
      throw new Error('Passwords must match!');
    }

    return true;
  });

exports.sanitizeComment = body('comment')
  .notEmpty()
  .withMessage('Comment must have some content!')
  .trim()
  .escape();

exports.flashErrors = (template, title) => (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash(
      'error',
      errors
        .array()
        .map((err) => err.msg)
        .join(', ')
    );

    res.render(template, {
      title: title,
      body: req.body,
      flashes: req.flash(),
    });
  } else {
    next();
  }
};

exports.flashCommentErrors = (template) => async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash(
      'error',
      errors
        .array()
        .map((err) => err.msg)
        .join(', ')
    );

    let post, config, title;

    if (req.params.slug) {
      const postPromise = Post.findOne({ slug: req.params.slug }).populate('author comments');
      const configPromise = Config.findOne();

      [post, config] = await Promise.all([postPromise, configPromise]);

      title = post.title;
    }

    res.render(template, {
      title: title,
      body: req.body,
      flashes: req.flash(),
      post,
      config,
    });
  } else {
    next();
  }
};
