const { Schema, model } = require("mongoose");

const folderSchema = new Schema(
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

const Folder = model("folders", folderSchema);

module.exports = Folder;