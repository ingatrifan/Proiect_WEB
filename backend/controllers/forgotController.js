const db = require('../models');
const mailSender = require('../utils/mailSender.js')
const url = require('url');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY_RESET";
const CONFIRM_SECRET = 'Our project is the best, ahahaha';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const httpSttatusCode = require('http-status-codes');

exports.forgotPassword = async(req,res)=>{
    try {
        let buffer='';
        req.on('data',function(data){
            buffer +=data;        
        });
        req.on('end', async function(){
            let data = JSON.parse(buffer);
            let user = await db.User.findOne({email:data.email});
            if (!user){
                res.statusCode = httpSttatusCode.NOT_FOUND;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({"success": false,"message":"This email doesn't exist" }));
            } 
            let resetToken = jwt.sign({email:user.email},PRIVATE_KEY,{ expiresIn: '1h'});
            mailSender.sendMail('forgot',user,resetToken)
            res.statusCode = httpSttatusCode.OK;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({"success": true,"message":"Successfully" }));
        })
    } catch (error) {
        console.error(error);
        res.statusCode = httpSttatusCode.INTERNAL_SERVER_ERROR;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({"success": false,"message": 'Error on setting forgot token'}));
    }
}
exports.resetPassword = async(req,res) =>{
    try {
        let buffer='';
        req.on('data',function(data){
            buffer +=data;        
        });
        req.on('end', async function(){
            let data = JSON.parse(buffer);
            let userData = jwt.verify(data.token,PRIVATE_KEY);
            let user = await db.User.findOne({email:userData.email});
            if (!user){
                res.statusCode = httpSttatusCode.NOT_FOUND;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({"success": false,"message":"This email doesn't exist or token invalid" }));
            }
            let password = await bcrypt.hash(data.password,saltRounds);
            user.password = password;
            await user.save();
            res.statusCode = httpSttatusCode.OK;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"success": true,"message":"Successfully changed password" }));
        })
    } catch (error) {
        console.error(error);
        res.statusCode = httpSttatusCode.INTERNAL_SERVER_ERROR;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'Error on reseting password'}));
    }
}
exports.confirmAccount = async(req,res)=>{
    try {
        let resetToken = url.parse(req.url,true).query.token;
        let userData= jwt.verify(resetToken,CONFIRM_SECRET);
        if(!userData){
            res.statusCode = httpSttatusCode.UNAUTHORIZED;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({"success": false,"message": 'The confirm token is invalid or expired'}));
        }
        let user = await db.User.findOne({email:userData.email});
        user.confirmed = true;
        await user.save();
        res.writeHead(302, {"Location" : "http://localhost/"});
        return res.end();
    } catch (error) {
        console.error(error);
        res.statusCode = httpSttatusCode.INTERNAL_SERVER_ERROR;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'Error on confirming account'}));
    }
}