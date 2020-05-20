const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');

async function getDriverInfo(accessToken){
    const curl = new Curl();
        const url='https://api.dropboxapi.com/2/users/get_space_usage';       
        curl.setOpt(Curl.option.URL,url);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
        curl.setOpt(Curl.option.CUSTOMREQUEST,'POST');
        curl.on('error', curl.close.bind(curl));
        curl.perform();
        return new Promise((resolve,reject)=>{
            curl.on('end', (statusCode, body) => {
                curl.close()
                //resolve(JSON.parse(body));
                console.log(body);
                resolve(JSON.parse(body));
              })      
        })
    }
    
    module.exports={
        getDriverInfo
    }