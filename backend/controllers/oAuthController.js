const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const oAuth = require('./oauth/authorize/authIndex');
const mainPage = require('../routes/mainPage');
const myURL=require('url');


exports.dropboxAuth = async(req,res) =>{
    
    let params =new URLSearchParams(myURL.parse(req.url).query);
    let code = params.get('code');
    let svtoken = params.get('state');
    await mainPage.renderMainPage(svtoken);
    let file = await mainPage.renderMainPage(token);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}

exports.googleAuth = async (req,res) =>{
    let params =new URLSearchParams(myURL.parse(req.url).query);
    let code = params.get('code');
    let svtoken = params.get('state');
    let test =await oAuth.googleAuth.getAccessToken(code);
    console.log(test.access_token);
    let test1= await oAuth.googleAuth.refreshAccessToken(test.refresh_token);
    console.log(test1);
    await oAuth.googleAuth.revokeToken(test1.access_token);
    let file = await mainPage.renderMainPage(svtoken);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}

exports.oneDriveAuth = async(req,res) =>{
    
    
    let params =new URLSearchParams(myURL.parse(req.url).query);
    let code = params.get('code');
    let svtoken = params.get('state');
    await oAuth.onedriveAuth.getAccessToken(code);
    let file = await mainPage.renderMainPage(svtoken);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}