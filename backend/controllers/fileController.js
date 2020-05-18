const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const uploadFuncs = require("../utils/upload")
const formidable = require("formidable")
const uploadController = require('./uploadController');

exports.upload = async (req,res) => {
   uploadController.upload(req,res);
}


exports.delete= async(req,res) =>{
    try {
        const queryObject = url.parse(req.url,true).query
        console.log(queryObject)
        let fileId = ObjectId(queryObject.id)
        await db.File.findByIdAndDelete(fileId)
        res.statusCode = HttpStatusCodes.OK
        res.setHeader('Content-Type', 'application/json')
        return res.write(JSON.stringify({success: true, message: 'Successfully deleted'}))     
    } catch (error) {
        console.error(error)
        res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({success: false, message: 'Something bad happend'}))
    }
}
exports.download = async(req,res) =>{
    try {
        const queryObject = url.parse(req.url,true).query
        console.log(queryObject)
        return res.write(JSON.stringify({success: true, message: 'Successfully downloaded'}))     
    } catch (error) {
        console.error(error)
        res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({success: false, message: 'Something bad happend'}))
    }
}