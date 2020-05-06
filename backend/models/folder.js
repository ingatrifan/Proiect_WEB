const { Schema, model } = require("mongoose");

const fileSchema = new Schema(
  {
    name: {
      type: String,
      default: null
    },
    files: {
      type: Array,
      default:[]
    }
  },
  {
    timestamps: true
  }
);

const File = model("folder", fileSchema);

module.exports = File;