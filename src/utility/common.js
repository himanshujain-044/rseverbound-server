const { AES, enc } = require("crypto-js");

module.exports.decryptPassword = (password = "") => {
  return AES.decrypt(password, process.env.ENCRYPTED_SECRET).toString(enc.Utf8);
};

module.exports.encryptPassword = (password = "") => {
  return AES.encrypt(password, process.env.ENCRYPTED_SECRET).toString();
};

module.exports.chunkArray = (array, chunkSize) => {
  const chunkedArray = [];
  while (array.length) {
    chunkedArray.push(array.splice(0, chunkSize));
  }
  return chunkedArray;
};
