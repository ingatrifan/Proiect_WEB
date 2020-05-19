const request = require('request')
const fs = require('fs');

exports.startSession = async( accessToken,filePath) =>{
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
                if(err) console.log(err); else 
                console.log(body);
                return body;
            })
    } catch (error) {
        console.log(error)
        return error;
    }
}
exports.appendToSession = async(accessToken,filePath,sessionId,offset)=>{
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
                console.log(httprs);
                console.log(body);
                return body;
            })
    } catch (error) {
        console.log(error)
        return error;
    }
}
exports.finishSession =async(accessToken,sessionId,offset,file)=>{
    try {
        let str = "{\"session_id\": \""+sessionId+"\",\"offset\": "+offset+"},\"commit\": {\"path\": \"/stol/"+file.name+"\",\"mode\": \"add\",\"autorename\": false,\"mute\": false,\"strict_conflict\": false}}"
        console.log(str)
        request.post(
            'https://content.dropboxapi.com/2/files/upload_session/finish',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"cursor\": {\"session_id\": \""+sessionId+"\",\"offset\": "+offset+"},\"commit\": {\"path\": \"/stol/"+file.name+"\",\"mode\": \"add\",\"autorename\": false,\"mute\": false,\"strict_conflict\": false}}",
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

