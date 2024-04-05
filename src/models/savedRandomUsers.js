const mongoose = require("mongoose");

const SavedRandomUsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const SavedRandomUsers = mongoose.model(
  "saved-random-users",
  SavedRandomUsersSchema
);
module.exports = SavedRandomUsers;
