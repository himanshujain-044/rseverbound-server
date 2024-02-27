const Joi = require("joi");
const { PAYMENT_METHOD } = require("../constants/enum");

module.exports = {
  updatePaymentMethodSchemaVal: Joi.object({
    paymentMethod: Joi.object({
      method: Joi.string()
        .valid(PAYMENT_METHOD.GPAY, PAYMENT_METHOD.PHONE_PAY)
        .required(),
      paymentAddress: Joi.string().required(),
    }).required(),
  }),
};
