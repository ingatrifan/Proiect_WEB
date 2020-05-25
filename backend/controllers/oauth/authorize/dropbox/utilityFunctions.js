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
 
async function getFileData(accessToken,idFile){
    return new Promise( async (resolve)=>{
        var data=`{
            "path": "${idFile}",
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        }`;
        console.log(data);
        const curl = new Curl();
        const url='https://api.dropboxapi.com/2/files/get_metadata'
        curl.setOpt(Curl.option.URL,url);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.POSTFIELDS,data);
        curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken,'Content-Type: application/json']);
        curl.setOpt(Curl.option.CUSTOMREQUEST, "POST");
        curl.on('error', curl.close.bind(curl));
        curl.perform();
            curl.on('end', (statusCode, body) => {
                curl.close()
                let result ={body: body,statusCode:statusCode}
                resolve(result);
              })      
        })
}
module.exports={
    getDriverInfo,getFileData
}