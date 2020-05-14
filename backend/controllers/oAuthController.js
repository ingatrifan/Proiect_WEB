const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const googleAuthorization = require('./oauth/authorize/google/googleAuth');
const oneDriveAuth = require('./oauth/authorize/onedrive/onedriveAuth');
const dropBoxAuth = require('./oauth/authorize/dropbox/dropboxAuth');
const mainPage = require('../routes/mainPage');
exports.dropboxAuth = (req,res) =>{
    dropBoxAuth.dropbox(req,res);
    res.write('SOME SHIT IN HERE');
    res.end();
    
}

exports.googleAuth = (req,res) =>{
    let token = googleAuthorization.googleAuth(req,res);
    //let r = mainPage.dummyFileRenderer(token);
    //r.pipe(res);
    res.write('SOME SHIT');
    res.end();
    //mainPage.mainPage(req,res);
}

exports.oneDriveAuth = (req,res) =>{
    oneDriveAuth.onedrive(req,res);
    res.write('SOME SHIT IN HERE');
    res.end();
}