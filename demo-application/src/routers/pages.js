const express = require('express');

const router = express.Router();
const { getlogInPage, getSignUpPage } = require('../controllers');

router.get('/login', getlogInPage);
router.get('/signup', getSignUpPage);

module.exports = router;
