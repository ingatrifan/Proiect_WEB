const { Schema, model } = require("mongoose");

const folderSchema = new Schema(
  {
    id_folder: {
      type: String,
      default: null
    },
    id_file: {
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