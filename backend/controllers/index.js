const loginController = require('./loginController');
const registerController = require('./registerController');
const uploadController = require('./uploadController');
const tokenVerifier = require('./tokenVerifierController');

//exports.uploadController = require("./uploadController")

exports.func =(req, res) =>{ 
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({success: true, message: 'example ran successfully'}))
}

module.exports={
    loginController,
    registerController,
    uploadController,
    tokenVerifier
}