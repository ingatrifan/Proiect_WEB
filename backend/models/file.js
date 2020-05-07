const { Schema, model } = require("mongoose");

const fileSchema = new Schema(
  {
    id_file: {
      type: String,
      default: null
    },
    id_user:{
      type:String,
      default:null
    },
    fileName:{
    type:String,
    default:null},
    extention:{
      type:String,
      default:null
    }
  },
  {
    timestamps: true
  }
);

const File = model("files", fileSchema);

module.exports = File;