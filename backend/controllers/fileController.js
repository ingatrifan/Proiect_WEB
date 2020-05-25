const url = require('url')
const db = require('../models')
const ObjectId = require('mongoose').Types.ObjectId
const HttpStatusCodes = require("http-status-codes");
const uploadController = require('./uploadController');
const downloadController = require('./downloadController');
const removeContorller = require('./removeController');
exports.upload = async (req,res) => {
   uploadController.upload(req,res);
}
exports.remove= async(req,res) =>{
    removeContorller.remove(req,res);
}
exports.download = async(req,res) =>{
    downloadController.donwload(req,res);
}