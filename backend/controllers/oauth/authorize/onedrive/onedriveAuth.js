const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
 async function  getAccessToken(code){
    let dataToSend={
        'code':code,
        'client_id':credentials.client_id,
        'redirect_uri': credentials.redirect_uris,    
        'client_secret':credentials.client_secret ,
        'grant_type':'authorization_code'
    };
    const url ='https://login.live.com/oauth20_token.srf';
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Content-Type: application/x-www-form-urlencoded']);
    curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
    curl.perform()
    curl.on('end', (statusCode, body) => {
        console.log('Body received from httpbin:')
        console.log(body)  
        curl.close()
      })      
    curl.on('error', curl.close.bind(curl))

    }
module.exports = {
    getAccessToken
};