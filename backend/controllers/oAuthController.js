const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const googleAuthorization = require('./oauth/authorize/google/googleAuth');
const oneDriveAuth = require('./oauth/authorize/onedrive/onedriveAuth');
const dropBoxAuth = require('./oauth/authorize/dropbox/dropboxAuth');
const mainPage = require('../routes/mainPage');

exports.dropboxAuth = async(req,res) =>{
    let token = await dropBoxAuth.dropbox(req,res);
    let r = await mainPage.renderMainPage(token);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    r.pipe(res);
}

exports.googleAuth = async (req,res) =>{
    let token = await googleAuthorization.googleAuth(req,res);
    let r = await mainPage.renderMainPage(token);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    r.pipe(res);
}

exports.oneDriveAuth = async(req,res) =>{
    let token = await oneDriveAuth.onedrive(req,res);
    let r = await mainPage.renderMainPage(token);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    r.pipe(res);
}