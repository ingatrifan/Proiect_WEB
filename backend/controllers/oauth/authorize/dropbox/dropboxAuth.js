const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
 async function  dropbox(req,res){
    let params =new URLSearchParams(myURL.parse(req.url).query);
    console.log(params);
    let dataToSend={
        'code':params.get("code")  ,
        'client_id':credentials.client_id,
        'redirect_uri': credentials.redirect_uris,    
        'client_secret':credentials.client_secret ,
        'grant_type':'authorization_code'
    };

    //curl https://api.dropbox.com/1/oauth2/token -d code=<authorization code> -d grant_type=authorization_code -d redirect_uri=<redirect URI> -u <app key>:<app secret>

    const url ='https://api.dropbox.com/1/oauth2/token';
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Content-Type: application/x-www-form-urlencoded']);
    curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
    curl.on('end', (statusCode, body) => {
        console.log('Body received from httpbin:');
        console.log(body)  ;
        curl.close();
      })      
    curl.on('error', curl.close.bind(curl));
    curl.perform();
    return params.get('state');
}
module.exports = {
    dropbox
};