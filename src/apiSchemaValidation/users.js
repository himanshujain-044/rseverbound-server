const Joi = require("joi");

module.exports = {
  userSchema: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
