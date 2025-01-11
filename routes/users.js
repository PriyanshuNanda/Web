const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catch_async');
const passport = require('passport');
const {storeReturnTo}=require('../middleware');
const userController=require('../controllers/users');

router.route('/register')
    .get(userController.registerForm)
    .post(catchAsync(userController.registerUser));

router.route('/login')
    .get(userController.loginForm)
    .post(storeReturnTo,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser);

router.get('/logout', userController.loginUser);

module.exports = router;