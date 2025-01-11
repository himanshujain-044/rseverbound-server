const { AES, enc } = require("crypto-js");
const moment = require("moment");
const { OTP_TYPE } = require("../constants/enum");

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

module.exports.generateMailSubject = (type) => {
  let subject = "";
  switch (type) {
    case OTP_TYPE.FORGOT_PASSWORD:
      subject = "Forgot Password OTP";
      break;
    default:
      subject = "OTP";
  }
  return subject;
};

module.exports.generateOTP = (digits = 6) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.calculateTimeDifference = (time1, time2, unit = "seconds") => {
  const moment1 = moment(time1);
  const moment2 = moment(time2);
  return moment2.diff(moment1, unit);
};

module.exports.uniqueArray = (arr1, arr2) => {
  let arr = [];
  if (arr1?.length > 0) {
    if (arr2?.length > 0) {
      arr = [...arr1, ...arr2];
    } else {
      arr = [...arr1];
    }
  } else if (arr2?.length > 0) {
    if (arr1?.length > 0) {
      arr = [...arr1, ...arr2];
    } else {
      arr = [...arr2];
    }
  }
  return [...new Set(arr)];
};
