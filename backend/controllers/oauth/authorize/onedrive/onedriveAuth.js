const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');

 async function  getAccessToken(code){
     console.log(code);
    let dataToSend={
        'code':code,
        'client_id':credentials.client_id,
        'redirect_uri': credentials.redirect_uris,    
        'client_secret':credentials.client_secret ,
        'grant_type':'authorization_code',
        'scope':'openid offline_access Files.ReadWrite.All'
    };
    const url ='https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Content-Type: application/x-www-form-urlencoded']);
    curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
    curl.perform()
    curl.on('error', curl.close.bind(curl))
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(JSON.parse(body));
          })      
    })
    }


    async function  refreshAccesstoken(refreshToken){
        let dataToSend={  
            'client_id':credentials.client_id,
            'redirect_uri': credentials.redirect_uris,
            'scope':'offline_access Files.ReadWrite.All',
            'client_secret':credentials.client_secret ,
            'grant_type':'refresh_token',
            'refresh_token':refreshToken
        };
        const url ='https://login.live.com/oauth20_token.srf';
        const curl = new Curl();
        curl.setOpt(Curl.option.URL,url);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,['Content-Type: application/x-www-form-urlencoded']);
        curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
        curl.perform()
        curl.on('error', curl.close.bind(curl))
        return new Promise((resolve,reject)=>{
            curl.on('end', (statusCode, body) => {
                curl.close()
                resolve(JSON.parse(body));
              })      
        })
        }
module.exports = {
    getAccessToken,refreshAccesstoken
};