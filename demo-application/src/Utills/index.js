const { singupSchema, singinSchema, comparePasswords } = require('./validations');
const { DataBaseError } = require('./customErrors');

module.exports = {
  singupSchema,
  singinSchema,
  DataBaseError,
  comparePasswords,
};
