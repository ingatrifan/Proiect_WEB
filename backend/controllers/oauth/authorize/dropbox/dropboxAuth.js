const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const tokenURL ='https://api.dropbox.com/1/oauth2/token';
 async function  getAccessToken(code){
    let dataToSend={
        'code':code,
        'client_id':credentials.client_id,
        'redirect_uri': credentials.redirect_uris,    
        'client_secret':credentials.client_secret ,
        'grant_type':'authorization_code'
    };
    //curl https://api.dropbox.com/1/oauth2/token -d code=<authorization code> -d grant_type=authorization_code -d redirect_uri=<redirect URI> -u <app key>:<app secret>
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,tokenURL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Content-Type: application/x-www-form-urlencoded']);
    curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
    curl.on('error', curl.close.bind(curl));
    curl.perform();
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(JSON.parse(body));
          })      
    });
}
//drop box din ce vad nu are refresh token call
// https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/API-v2-access-token-validity/td-p/215123
 async function refreshAccessToken(token){

 }
 async function revokeAccessToken(token){
    const curl = new Curl();
    const url='https://api.dropboxapi.com/2/auth/token/revoke';       
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+token]);
    curl.setOpt(Curl.option.CUSTOMREQUEST, "POST");
    curl.on('error', curl.close.bind(curl));
    curl.perform();
    console.log("revoking");
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(statusCode);
          })      
    })
 }



module.exports = {
    getAccessToken,revokeAccessToken
};