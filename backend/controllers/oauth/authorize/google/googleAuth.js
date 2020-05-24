const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const tokenURL='https://oauth2.googleapis.com/token';
const cntType =['Content-Type: application/x-www-form-urlencoded'];
 async function  getAccessToken(code){
    let dataToSend={
        'code':code,
        'scope':'https://www.googleapis.com/auth/drive',
        'client_id':credentials.client_id,
        'redirect_uri': credentials.redirect_uris,    
        'client_secret':credentials.client_secret ,
        'grant_type':'authorization_code'
    };
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,tokenURL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,cntType);
    curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
    curl.on('error', curl.close.bind(curl))
    curl.perform()

    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(JSON.parse(body));
          })      
    });
}


async function refreshAccessToken(refreshToken){
    let dataToSend={
        'refresh_token':refreshToken,
        'client_id':credentials.client_id,
        'client_secret':credentials.client_secret ,
        'grant_type':'refresh_token'
    };
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,tokenURL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,cntType);
    curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
    curl.on('error', curl.close.bind(curl))
    curl.perform()

    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(JSON.parse(body));
          })      
    });
}
async function revokeToken(token){
    const curl = new Curl();
    const url='https://oauth2.googleapis.com/revoke?token='+token;       
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,cntType);
    curl.setOpt(Curl.option.CUSTOMREQUEST, "POST");
    curl.on('error', curl.close.bind(curl));
    curl.perform();
    console.log("revoking");
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(statusCode);
          })      
    });
}

// asta doar la google drive am gasit
async function checkToken(token){
    const curl = new Curl();
    const url='https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token;       
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,cntType);
    //curl.setOpt(Curl.option.CUSTOMREQUEST, "POST");
    curl.on('error', curl.close.bind(curl));
    curl.perform();
    console.log("revoking");
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            if(statusCode==200){
                let value  =JSON.parse(body);
                if(value['error']){
                    resolve(false);
                }
                resolve(true);
            }
            resolve(false);
          })      
    });
}
module.exports = {
    getAccessToken,refreshAccessToken,revokeToken,checkToken
};