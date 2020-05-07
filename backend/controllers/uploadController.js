const HttpStatusCodes = require("http-status-codes");
const uploadFuncs = require("../utils/upload")
const formidable = require("formidable")

exports.upload = async (req,res) => {
  try {
    console.log("got here")
    const form = formidable({ multiples: true })
    form.parse(req, (err, fields, files) => {
      console.log(JSON.stringify({ fields, files }))
      if (files){
        uploadFuncs.googleUpload(files.file)
        res.statusCode = HttpStatusCodes.OK
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify({success: true, message: 'Successfully upload'}))
      }
      res.statusCode = HttpStatusCodes.BAD_REQUEST
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify({success: false, message: 'NO file found'}))
    });
  } catch (error) {
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({success: false, message: 'Something bad happend'}))
  }
}

