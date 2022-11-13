const Joi = require('joi');

const singinSchema = Joi.object({

  email: Joi.string().email().max(50).required(),
  password: Joi.string().alphanum().min(7).max(20)
    .required(),

});

module.exports = singinSchema;
