const request = require('request')
const fs = require('fs');

const uploadFile = async (accessToken,file) =>{
    try {
        request.post(
            ' https://content.dropboxapi.com/2/files/upload',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"path\": \"/stol/"+file.name+"\",\"mode\": \"add\",\"autorename\": false,\"mute\": false,\"strict_conflict\": false}",
                    "Content-Type": "application/octet-stream"
                },
                body:fs.createReadStream(file.path)
            } , function resp(err,httprs,body){
                if(err) console.log(err); else 
                console.log(body);
                return body;
            })
    } catch (error) {
        console.log(error)
        return error;
    }
}
const downloadFile = async (accessToken,filePath) =>{
    try {
        request.post(
            'https://content.dropboxapi.com/2/files/download',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"path\": \""+filePath+"\"}"
                }
            } , function resp(err,httprs,body){
                if(err) console.log(err); else 
                console.log(body);
                return body;
            })
        
    } catch (error) {
        console.log(error)
        return error;
    }
}
const deleteFile = async(accessToken,file) =>{
    try {
        let filePath = "{\"path\": \""+file+"\"}";
        request.post(
            'https://api.dropboxapi.com/2/files/delete_v2',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Content-Type": "application/json"
                },
                body:filePath
            } , function resp(err,httprs,body){
                if(err) console.log(err); else 
                return body;
            })
        
    } catch (error) {
        console.log(error)
        return error;
    }
}

module.exports = {
    uploadFile,downloadFile,deleteFile
}