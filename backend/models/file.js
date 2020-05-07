const { Schema, model } = require("mongoose");

const fileSchema = new Schema(
  {
    id_file: {
      type: String,
      default: null
    },
    id_user :{
      type: String,
      default:null
    },
    fileName:{
      type:String,
      default:null
    },
    extension:{
      type:String,
      default:null
    },
    location:{
      type:String,
      default:null
    },
    lastLength:{
      type:Int32Array,
      defautl:null

    }
  },
  {
    timestamps: true
  }
);

const File = model("files", fileSchema);

module.exports = File;