const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const googleAuthorization = require('./oauth/authorize/google/googleAuth');
exports.dropboxAuth = (req,res) =>{
    
}

exports.googleAuth = (req,res) =>{
    googleAuthorization.googleAuth(req,res);
    res.write('SOME SHIT IN HERE');
    res.end();
}

exports.oneDriveAuth = (req,res) =>{
    
}