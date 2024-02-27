const Joi = require("joi");

module.exports = {
  updateBrokrageSchemaVal: Joi.object({
    dates: Joi.array().items(Joi.string()).required(),
  }),
};
