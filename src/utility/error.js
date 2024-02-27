// Define a custom Error class that extends the built-in Error class
class ErrorClass extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = ErrorClass;
