const signUpValidation = require('./signUpValidation');
const setToken = require('./userToken');
const handleErrors = require('./handleErrors');
const signInValidation = require('./signInValidation');
const clearCookies = require('./clearCookies');
const checkToken = require('./checkToken');

module.exports = {
  signUpValidation,
  signInValidation,
  setToken,
  handleErrors,
  clearCookies,
  checkToken,
};
