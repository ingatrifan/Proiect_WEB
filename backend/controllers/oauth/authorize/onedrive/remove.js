const fs = require('fs');
const utility= require('./utilityFunctions');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');

async function remove (accessToken,fileId){
  return new Promise((resolve,reject)=> {
    const url = 'https://graph.microsoft.com/v1.0/me/drive/items/'+fileId;
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
    curl.setOpt(Curl.option.CUSTOMREQUEST,'DELETE');
    curl.on('error', curl.close.bind(curl));
    curl.perform();
      curl.on('end', (statusCode,body) => {
        if(statusCode!== 204) {
          console.log('Error while trying to delete')
          //HANDLING THROWS
        }
        console.log(body);
        resolve(statusCode);
        curl.close();
      });
    });
  }
  

module.exports={
      remove
  }