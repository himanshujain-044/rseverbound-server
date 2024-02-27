const jwt = require("jsonwebtoken");
const { STATUS, ERROR_MSG } = require("../constants/messages");
const Users = require("../models/users");

module.exports.verifyAuthToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(STATUS.badRequest).send({
      message: ERROR_MSG.noToken,
      status: STATUS.unauth,
    });
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Users.findOne({
        email: decoded.email,
        token,
      });
      if (!user) throw new Error(ERROR_MSG.noUserFound);
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      if (err.message === "jwt expired")
        res.status(STATUS.unauth).send({
          error: ERROR_MSG.tokenExpired,
          message: ERROR_MSG.tokenExpired,
          status: STATUS.unauth,
        });
      else
        res
          .status(STATUS.unauth)
          .send({ error: err.message, status: STATUS.unauth });
    }
  }
};
module.exports.signToken = (payload = {}) => {
  return jwt.sign({ ...payload }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
