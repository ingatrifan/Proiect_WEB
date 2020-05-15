const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const oAuth = require('./oauth/authorize/authIndex');
const mainPage = require('../routes/mainPage');
const myURL=require('url');

//TO DO, PUT THE ACCESSS , REFRESH TOKENS IN DB, 
//EXCEPTIONS,  RELOADING THE PAGE, WHAT HAPPENS WITH THE CALLS
exports.dropboxAuth = async(req,res) =>{
    let params =new URLSearchParams(myURL.parse(req.url).query);
    let code = params.get('code');
    let svtoken = params.get('state');
    let data = await oAuth.dropboxAuth.getAccessToken(code);
    console.log(data);
    //let resu= await oAuth.dropboxAuth.revokeAccessToken(data.access_token);

    await mainPage.renderMainPage(svtoken);
    let file = await mainPage.renderMainPage(svtoken);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}

exports.googleAuth = async (req,res) =>{
    let params =new URLSearchParams(myURL.parse(req.url).query);
    let code = params.get('code');
    let svtoken = params.get('state');
    let data =await oAuth.googleAuth.getAccessToken(code);
    console.log(data);
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
    let data = await oAuth.onedriveAuth.getAccessToken(code);
    console.log(data);
    let result = await oAuth.onedriveAuth.refreshAccesstoken(data.refresh_token);
    console.log(result);
    let file = await mainPage.renderMainPage(svtoken);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    file.pipe(res);
}