const { singupSchema, DataBaseError } = require('../Utills');
const { getUserByEmailQuery } = require('../database/queries');

const signUpValidation = (req, res, next) => {
  const {
    userName, email, password, confirmPassword, gender,
  } = req.body;
  singupSchema.validateAsync({
    username: userName, email, password, confirmPassword, gender,
  })
    .then((validatedData) => {
      getUserByEmailQuery(validatedData).then((data) => {
        if (data.rowCount) {
          next(new DataBaseError('The email you entered is already registered !'))
          //throw new DataBaseError('The email you entered is already registered !');
        } else {
          next();
        }
      }).catch((err) => {
        next(err);
      });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = signUpValidation;
