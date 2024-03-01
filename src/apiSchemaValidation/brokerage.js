const Joi = require("joi");

module.exports = {
  updateBrokerageSchemaVal: Joi.object({
    dates: Joi.array().items(Joi.string()).required(),
  }),
};
