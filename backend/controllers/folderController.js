const httpsStatusCodes = require('http-status-codes');
const db = require('../models');
const url = require('url');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";

exports.createFolder = async(req,res) =>{
    try {
        let {token, name,parent} = url.parse(req.url,true).query;
        let data = jwt.verify(token,PRIVATE_KEY);
        console.log(data)
        if (!data){
            res.statusCode = httpsStatusCodes.UNAUTHORIZED;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({"success": false,"message": 'Token is invalid'}));
        }
        let user = await db.User.findOne({email: data.user});
        if (!user){
            res.statusCode = httpsStatusCodes.UNAUTHORIZED;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({"success": false,"message": 'User does not exist'}));
        }
        console.log('PARRENT',parent);
        if (parent === 'undefined')parent = null;
        console.log('PARRENT',parent);
        let folder = new db.File({fileName:name,id_user:user.email,folder:parent});
        await folder.save();
        folder.id_file = folder._id;
        await folder.save();
        res.statusCode = httpsStatusCodes.CREATED;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({"success": true,"message": "Folder created"}));
    } catch (error) {
        console.error(error);
        res.statusCode = httpsStatusCodes.INTERNAL_SERVER_ERROR;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'Error on creating a folder'}));
    }
}
exports.getFolderParent =async (req,res) =>{
    try {
        let {parent} = url.parse(req.url,true).query;
        let folder = await db.File.findById({_id:parent});
        if (!folder){
            res.statusCode = httpsStatusCodes.BAD_REQUEST;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({"success": false,"message": 'Folder does not exist'}));
        }
        console.log("parent:"+folder.fileName)
        res.statusCode = httpsStatusCodes.CREATED;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({"success": true,"message": `${folder.folder}`}));

    } catch (error) {
        console.error(error);
        res.statusCode = httpsStatusCodes.INTERNAL_SERVER_ERROR;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'Error on getting parent folder'}));
    }
}