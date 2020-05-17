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
    dropboxFragments:{
      type:Array,
      default:null
    },
    googleFragments:{
      type:Array,
      default:null
    },
    driveFragments:{
      type:Array,
      default:null
    },
    lastLength:{
      type:Number,
      defautl:null
    }
  },
  {
    timestamps: true
  }
);

const File = model("files", fileSchema);

module.exports = File;