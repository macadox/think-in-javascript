const express = require('express');
const viewsController = require('../controllers/viewsController');
const userController = require('../controllers/userController');
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
      userController.sanitizeEmail,
      userController.sanitizeName,
      userController.sanitizePassword,
      userController.confirmPassword,
    ],
    userController.flashErrors,
    tryCatch(userController.signup),
    authController.login
  );

router.get('/logout', authController.logout);

router.get(
  '/admin',
  authController.isLoggedIn,
  authController.hasPermissionPower(16),
  (req, res) => {
    res.send('This is admin panel, its open');
  }
);

router.route('/').get((req, res) => {
  res.render('posts', {
    title: 'Test title',
  });
});

module.exports = router;
