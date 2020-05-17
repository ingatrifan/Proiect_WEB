const fs = require('fs');
const url=require('url');
const querystring = require('querystring');
const fc = require('./upload');
const db = require('../models')

exports.download = async(req,res)=>{

}


exports.upload  = async(user,file,fileId) =>{
    try {
        let connUser = await db.User.findOne({email:user.email});
        let accessTkn = connUser.dropboxAuth.accessToken;
        let response = await fc.uploadFile(accessTkn,file);
        let filePath = response["path lower"];
        let dbFile = await db.File.find(fileId);
        dbFile.dropboxFragments.push(filePath);
        
    } catch (error) {
        
    }
}


exports.remove = async(req,res) =>{
    
}

module.exports ={
    download,upload,remove
}