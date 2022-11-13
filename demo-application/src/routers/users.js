const express = require('express');

const router = express();
const { setUser, getHomePage } = require('../controllers');
const {
  signUpValidation, signInValidation, setToken, handleErrors, clearCookies,
} = require('../middleWares');

router.route('/signUp').post(signUpValidation, setUser, setToken, getHomePage, handleErrors);
router.route('/signIn').post(signInValidation, setToken, getHomePage, handleErrors);
router.route('/logout').get(clearCookies, getHomePage);
module.exports = router;
