const { AES, enc } = require("crypto-js");
const moment = require("moment");
const { OTP_TYPE, NUMBERS_DIGITS_UNITS } = require("../constants/enum");

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

module.exports.numberToWords = (number) => {
  let [num, decimalPoints] = String(number)?.split(".");
  if ((num = num.toString()).length > 9) return "Overflow";
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (NUMBERS_DIGITS_UNITS.TEENS[Number(n[1])] ||
          NUMBERS_DIGITS_UNITS.TENS[n[1][0]] +
            " " +
            NUMBERS_DIGITS_UNITS.TEENS[n[1][1]]) + "Crore "
      : "";
  str +=
    n[2] != 0
      ? (NUMBERS_DIGITS_UNITS.TEENS[Number(n[2])] ||
          NUMBERS_DIGITS_UNITS.TENS[n[2][0]] +
            " " +
            NUMBERS_DIGITS_UNITS.TEENS[n[2][1]]) + "Lakh "
      : "";
  str +=
    n[3] != 0
      ? (NUMBERS_DIGITS_UNITS.TEENS[Number(n[3])] ||
          NUMBERS_DIGITS_UNITS.TENS[n[3][0]] +
            " " +
            NUMBERS_DIGITS_UNITS.TEENS[n[3][1]]) + "Thousand "
      : "";
  str +=
    n[4] != 0
      ? (NUMBERS_DIGITS_UNITS.TEENS[Number(n[4])] ||
          NUMBERS_DIGITS_UNITS.TENS[n[4][0]] +
            " " +
            NUMBERS_DIGITS_UNITS.TEENS[n[4][1]]) + "Hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (NUMBERS_DIGITS_UNITS.TEENS[Number(n[5])] ||
          NUMBERS_DIGITS_UNITS.TENS[n[5][0]] +
            " " +
            NUMBERS_DIGITS_UNITS.TEENS[n[5][1]]) +
        ""
      : "";
  // const decArr = decimalPoints?.split("");
  // if (decArr?.length) {
  //   const lastDecmal = NUMBERS_DIGITS_UNITS.TEENS[decArr?.[1]]
  //     ? NUMBERS_DIGITS_UNITS.TEENS[decArr?.[1]]
  //     : "";
  //   return (
  //     str +
  //     "Points " +
  //     NUMBERS_DIGITS_UNITS.TEENS[decArr[0]] +
  //     lastDecmal +
  //     " Only"
  //   );
  // } else {
  return str?.length ? str + " Only" : "";
  // }
};
