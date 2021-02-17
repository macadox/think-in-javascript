const express = require('express');
const viewsController = require('../controllers/viewsController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const sanitizationController = require('../controllers/sanitizationController');
const authController = require('../controllers/authController');
const { tryCatch } = require('../handlers/errorHandler');
// const viewsController = require('./../controllers/viewsController');

const router = express.Router();

router.route('/login').get(userController.loginForm).post(authController.login);
router
  .route('/signup')
  .get(userController.signUpForm)
  .post(
    [
      sanitizationController.sanitizeEmail,
      sanitizationController.sanitizeName,
      sanitizationController.sanitizePassword,
      sanitizationController.confirmPassword,
    ],
    sanitizationController.flashErrors('signup', 'Sign Up'),
    tryCatch(userController.signup),
    authController.login
  );

router.get('/logout', authController.logout);
router.post('/forgot', tryCatch(authController.forgotPassword));
router
  .route('/reset/:token')
  .get(userController.passwordResetForm)
  .post(
    [
      sanitizationController.sanitizePassword,
      sanitizationController.confirmPassword,
    ],
    sanitizationController.flashErrors('passwordReset', 'Password Reset'),
    tryCatch(authController.resetPassword)
  );

router.get(
  '/admin',
  authController.isLoggedIn,
  authController.hasPermissionPower(15),
  (req, res) => {
    res.send('You have enough permission to access admin panel');
  }
);

router
  .route('/contact')
  .get(viewsController.getContact)
  .post(
    [sanitizationController.sanitizeEmail, sanitizationController.sanitizeName],
    sanitizationController.flashErrors('contactMe', 'Contact Me :)'),
    viewsController.sendContactMessage
  );

router.get('/about',viewsController.getRecent, viewsController.getAbout)

router.route('/').get(viewsController.getRecent, viewsController.getHomepage);
router
  .route('/post/:slug')
  .get(viewsController.getRecent, tryCatch(viewsController.getPostBySlug));

router
  .route('/post/:slug/comments')
  .post(
    authController.isLoggedIn,
    sanitizationController.sanitizeComment,
    sanitizationController.flashCommentErrors(`post`),
    commentController.addComment
  );

router
  .route('/tags')
  .get(viewsController.getRecent, tryCatch(viewsController.getPostsByTag));
router
  .route('/tags/:tag')
  .get(viewsController.getRecent, tryCatch(viewsController.getPostsByTag));

router
  .route('/categories')
  .get(viewsController.getRecent, tryCatch(viewsController.getCategories));
router
  .route('/categories/:cat')
  .get(viewsController.getRecent, tryCatch(viewsController.getPostsByCategory));

router
  .route('/search')
  .get(viewsController.getRecent, tryCatch(postController.searchPosts));

module.exports = router;
