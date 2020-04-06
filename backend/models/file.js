const { Schema, model } = require("mongoose");

const fileSchema = new Schema(
  {
    name: {
      type: String,
      default: null
    },
    path: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true
  }
);

const File = model("files", fileSchema);

module.exports = File;