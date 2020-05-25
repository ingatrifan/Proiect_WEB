const request = require('request');

async function remove(accessToken,file) {
    new Promise((resolve,reject)=>{
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
                resolve('deleted one drop box');
            })
        
    } catch (error) {
        console.log(error)
        reject(error);
    }
});
}

module.exports={
    remove
}