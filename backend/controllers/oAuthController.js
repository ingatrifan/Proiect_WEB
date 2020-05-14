const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const googleAuthorization = require('./oauth/authorize/google/googleAuth');
const oneDriveAuth = require('./oauth/authorize/onedrive/onedriveAuth');
const dropBoxAuth = require('./oauth/authorize/dropbox/dropboxAuth');
exports.dropboxAuth = (req,res) =>{
    dropBoxAuth.dropbox(req,res);
    res.write('SOME SHIT IN HERE');
    res.end();
}

exports.googleAuth = (req,res) =>{
    googleAuthorization.googleAuth(req,res);
    res.write('SOME SHIT IN HERE');
    res.end();
}

exports.oneDriveAuth = (req,res) =>{
    //oneDriveAuth.onedrive(req,res);
    res.write('SOME SHIT IN HERE');
    res.end();
}