const request = require('request')
const fs = require('fs');

exports.startSession = async( accessToken,filePath) =>{
    return new Promise((resolve,reject)=>{
    try {
        request.post(
            'https://content.dropboxapi.com/2/files/upload_session/start',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"close\": false}",
                    "Content-Type": "application/octet-stream"
                },
                body:fs.createReadStream(filePath)
            } , function resp(err,httprs,body){
                if(err) console.log(err); 
                    else 
                resolve(body);
            })
    } catch (error) {
   
   reject(error);
    }
});
}
exports.appendToSession = async(accessToken,filePath,sessionId,offset)=>{
    return new Promise( (resolve,reject)=>{
    try {
        request.post(
            'https://content.dropboxapi.com/2/files/upload_session/append_v2',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"cursor\": {\"session_id\": \""+sessionId+"\",\"offset\": "+offset+"},\"close\": false}",
                    "Content-Type": "application/octet-stream"
                },
                body:fs.createReadStream(filePath)
            } , function resp(err,httprs,body){
                if(err) console.log(err); else 
                resolve(body);
            })
    } catch (error) {
        reject(error);
    }
});
}
exports.finishSession =async(accessToken,sessionId,offset,fileName,filePath)=>{
    return new Promise((resolve,reject)=>{
    try {
        let str = "{\"session_id\": \""+sessionId+"\",\"offset\": "+offset+"},\"commit\": {\"path\": \"/stol/"+fileName+"\",\"mode\": \"add\",\"autorename\": false,\"mute\": false,\"strict_conflict\": false}}"
        console.log(str)
        request.post(
            'https://content.dropboxapi.com/2/files/upload_session/finish',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"cursor\": {\"session_id\": \""+sessionId+"\",\"offset\": "+offset+"},\"commit\": {\"path\": \"/stol/"+fileName+"\",\"mode\": \"add\",\"autorename\": false,\"mute\": false,\"strict_conflict\": false}}",
                    "Content-Type": "application/octet-stream"
                },
                body:fs.createReadStream(filePath)
            } , function resp(err,httprs,body){
                if(err) console.log(err);
                     else 
                resolve(body);
            })
    } catch (error) {
        reject(error);
    }
})
}


exports.smallUpload =async(accessToken,fileName,filePath)=>{
    return new Promise((resolve,reject)=>{
    try {
        request.post(
            'https://content.dropboxapi.com/2/files/upload',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"path\": \"/stol/"+fileName+"\",\"mode\": \"add\",\"autorename\": false,\"mute\": false,\"strict_conflict\": false}",
                    "Content-Type": "application/octet-stream"
                },
                body:fs.createReadStream(filePath)
            } , function resp(err,httprs,body){
                if(err) console.log(err);
                     else 
                resolve(body);
            })
    } catch (error) {
        reject(error);
    }
})
}