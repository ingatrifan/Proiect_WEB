const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const oAuth = require('./oauth/authorize/authIndex');
const mainPage = require('../routes/mainPage');


exports.dropboxAuth = async(req,res) =>{
    let token = await oAuth.dropBoxAuth.dropbox(req,res);
    let file = await mainPage.renderMainPage(token);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}

exports.googleAuth = async (req,res) =>{
    let token = await oAuth.googleAuthorization.googleAuth(req,res);
    let file = await mainPage.renderMainPage(token);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}

exports.oneDriveAuth = async(req,res) =>{
    let token = await oAuth.oneDriveAuth.onedrive(req,res);
    let file = await mainPage.renderMainPage(token);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}