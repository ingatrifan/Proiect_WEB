const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      required: true,
      type: String
    },
    firstName: {
      type: String,
      default: null
    },
    lastName: {
      type: String,
      default: null
    },
    password: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = model("users", userSchema);

module.exports = User;