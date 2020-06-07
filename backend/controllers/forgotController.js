const db = require('../models');
const mailSender = require('../utils/mailSender.js')
const url = require('url');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY_RESET";
const CONFIRM_SECRET = 'Our project is the best, ahahaha';

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
                res.writeHead(404, {"Content-Type": 'text/plain'});
                res.write("This email doesn't exist");
                res.end();
                return;
            } 
            let resetToken = jwt.sign({email:user.email},PRIVATE_KEY,{ expiresIn: '1h'});
            mailSender.sendMail('forgot',user,resetToken)
            res.writeHead(200, {"Content-Type": 'text/plain'});
            res.write("OK");
            res.end();
            return;
        })
    } catch (error) {
        console.error(error);
        res.writeHead(404, {"Content-Type": 'text/plain'});
        res.write("Something bad happend");
        res.end();
        return;
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
            console.log(data.token)
            let userData = jwt.verify(data.token,PRIVATE_KEY);
            let user = await db.User.findOne({email:userData.email});
            if (!user){
                res.writeHead(404, {"Content-Type": 'text/plain'});
                res.write("The reset token is invalid or expired");
                res.end();
                return;
            }
            user.password = data.password;
            console.log(userData.email)
            user.save().then(()=>console.log('user saved'));
            res.writeHead(200, {"Content-Type": 'text/plain'});
            res.write("OK");
            res.end();
            return;
        })
    } catch (error) {
        console.error(error);
        res.writeHead(404, {"Content-Type": 'text/plain'});
        res.write("Something bad happend");
        res.end();
        return;
    }
}
exports.confirmAccount = async(req,res)=>{
    try {
        let resetToken = url.parse(req.url,true).query.token;
        console.log(resetToken)
        let userData= jwt.verify(resetToken,CONFIRM_SECRET);
        if(!userData){
            res.writeHead(404, {"Content-Type": 'text/plain'});
            res.write("The confirm token is invalid or expired");
            res.end();
            return;
        }
        let user = await db.User.findOne({email:userData.email});
        user.confirmed = true;
        await user.save();
        res.writeHead(302, {"Location" : "http://localhost/"});
        res.end();
        return;
    } catch (error) {
        console.error(error);
        res.writeHead(404, {"Content-Type": 'text/plain'});
        res.write("Something bad happend");
        res.end();
        return;
    }
}