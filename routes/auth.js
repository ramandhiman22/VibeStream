const express = require('express');
const AuthController = require('../controller/auth.controller');
const passport = require('passport');
const router = express.Router();
router.get('/signup', AuthController.showSignupForm);
router.get('/verify',AuthController.showVerifyPage);
router.post('/verify',AuthController.Verify);
router.get('/login', AuthController.showLoginForm);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true
}),AuthController.login);
router.post('/signup', AuthController.signup);
router.get('/verifySms',AuthController.showSmsVerifyPage);
router.post('/verifySms',AuthController.verifySms);
router.get('/forgot-password', AuthController.showForgotPassword);
router.post('/forgot-password', AuthController.forgotPassword);

// Reset Password routes
router.get('/reset-password', AuthController.showResetPassword);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;