const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      required: true,
      type: String
    },
    name: {
      type: String,
      default: null
    },
    password: {
      required: true,
      type: String
    },
    googleAuth: {
      accessToken:{
        type:String,
        default:null
      },
      refreshToken:{
        type:String,
        default:null
      }
      ,authorized:{
        type:Boolean,
        default:null
      },
      lastAccessed:{
        type:Date,
        default:null
      }
    },
    dropboxAuth: {
      accessToken:{
        type:String,
        default:null
      },
      refreshToken:{// doesn't have refreh token
        type:String,
        default:null
      }
      ,
      authorized:{
        type:Boolean,
        default:null
      },
      lastAccessed:{
        type:Date,
        default:null
      }
    },
    oneDriveAuth: {
      accessToken:{
        type:String,
        default:null
      },
      refreshToken:{
        type:String,
        default:null
      },authorized:{
        type:Boolean,
        default:null
      },lastAccessed:{
        type:Date,
        default:null
      }
    }
  },
  {
    timestamps: true
  }
);

const User = model("users", userSchema);

module.exports = User;