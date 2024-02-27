module.exports = {
  ERROR_MSG: {
    commonError: "Something went wrong.",
    noToken: "Please provide authorization header",
    badRequest: "Invalid request.",
    noUserFound: "No User Found !",
    internalServer: "Internal server error.",
    unAuthorized: "You are not authorized.",
    userNotFound: "User does not exist",
    tokenExpired: "Token has been expired",
  },
  SUCCESS_MSG: {},
  STATUS: {
    success: 200,
    unauth: 401,
    forbidden: 403,
    internalServer: 500,
    badRequest: 400,
  },
};
