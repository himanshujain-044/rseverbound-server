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
  // 1. Calculate the current financial year based on today's date
  const today = new Date();
  const currentMonth = today.getMonth(); // 0 = January, 3 = April
  const currentYear = today.getFullYear();

  // Financial year changes on April 1st (Month index 3)
  let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
  let endYear = startYear + 1;

  // Format to "26-27"
  const currentFinYearStr = `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;

  // 2. Fallback if no previous invoice exists (e.g., brand new system setup)
  if (!lastInvoiceNumber) {
    return `INV/${currentFinYearStr}/01`;
  }

  // 3. Break down the last invoice (Expected: "INV/26-27/01")
  const parts = lastInvoiceNumber.split("/");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid previous invoice format. Must match 'INV/YY-YY/XX'",
    );
  }

  const lastFinYear = parts[1]; // Extracts "26-27"
  const lastCounter = parseInt(parts[2], 10); // Extracts the number (e.g., 1)

  let nextCounter;

  // 4. Reset logic: Check if we have entered a new financial year
  if (currentFinYearStr !== lastFinYear) {
    nextCounter = 1; // Reset to 1 because the fiscal year changed
  } else {
    nextCounter = lastCounter + 1; // Increment normally
  }

  // 5. Pad the number with a leading zero if it's a single digit
  const paddedCounter = String(nextCounter).padStart(2, "0");

  // 6. Return the newly constructed invoice string
  return `INV/${currentFinYearStr}/${paddedCounter}`;
};
