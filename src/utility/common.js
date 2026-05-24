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

module.exports.getNextInvoiceNumber = (lastInvoiceNumber) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
  let endYear = startYear + 1;
  const currentFinYearStr = `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
  if (!lastInvoiceNumber) {
    return `INV/${currentFinYearStr}/01`;
  }
  const parts = lastInvoiceNumber.split("/");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid previous invoice format. Must match 'INV/YY-YY/XX'",
    );
  }

  const lastFinYear = parts[1];
  const lastCounter = parseInt(parts[2], 10);

  let nextCounter;
  if (currentFinYearStr !== lastFinYear) {
    nextCounter = 1;
  } else {
    nextCounter = lastCounter + 1;
  }
  const paddedCounter = String(nextCounter).padStart(2, "0");
  return `INV/${currentFinYearStr}/${paddedCounter}`;
};

module.exports.getNextDeliveryChNumber = (lastDeliveryChNumber) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
  let endYear = startYear + 1;
  const currentFinYearStr = `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
  if (!lastDeliveryChNumber) {
    return `DEL/${currentFinYearStr}/01`;
  }
  const parts = lastDeliveryChNumber.split("/");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid previous invoice format. Must match 'DEL/YY-YY/XX'",
    );
  }

  const lastFinYear = parts[1];
  const lastCounter = parseInt(parts[2], 10);

  let nextCounter;
  if (currentFinYearStr !== lastFinYear) {
    nextCounter = 1;
  } else {
    nextCounter = lastCounter + 1;
  }
  const paddedCounter = String(nextCounter).padStart(2, "0");
  return `DEL/${currentFinYearStr}/${paddedCounter}`;
};
