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
        if(!parent) parent = null;
        let folder = new db.File({fileName:name,id_user:user.email,folder:parent});
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