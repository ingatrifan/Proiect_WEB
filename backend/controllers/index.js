
exports.uploadController = require("./uploadController")

exports.func =(req, res) =>{ 
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({success: true, message: 'example ran successfully'}))
}
