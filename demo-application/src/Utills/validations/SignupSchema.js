const Joi = require('joi');

const singupSchema = Joi.object({
  username: Joi.string().alphanum().min(7).max(20)
    .required(),
  email: Joi.string().email().max(50).required(),
  password: Joi.string().alphanum().min(7).max(20)
    .required(),
  confirmPassword: Joi.ref('password'),
  gender: Joi.string().min(4).max(20),
})

  .with('password', 'confirmPassword');

module.exports = singupSchema;
