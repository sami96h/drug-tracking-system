const bcrypt = require('bcrypt');
const { singinSchema, DataBaseError, comparePasswords } = require('../Utills');
const { getUserByEmailQuery, getUserByIdQuery } = require('../database/queries');

const signInValidation = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  singinSchema.validateAsync({
    email, password,
  })
    .then((validatedData) => {
      getUserByEmailQuery(validatedData).then((data) => {
        if (data.rowCount) {
          const { id } = data.rows[0];

          getUserByIdQuery(id)
            .then((returnedData) => {
              const hashedPassword = returnedData.rows[0].password;
              comparePasswords(password, hashedPassword)
                .then((result) => {
                  if (result) {
                    req.body.userId = id;
                    next();
                  } else {
                    next(new DataBaseError('Incorrect password'));
                  }
                })
                .catch(() => {
                  next(new DataBaseError('Comparing the password has failed !'));
                });
            })
            .catch(() => {
              next(new DataBaseError('Error during query by Id!'));
            });
        } else {
          next(new DataBaseError('The email that you have entered is not registered !'));
        }
      }).catch(() => {
        next(new DataBaseError('Error during query by email address!'));
      });
    })
    .catch(() => {
      next(new DataBaseError('Error in validating the email and password !'));
    });
};

module.exports = signInValidation;
