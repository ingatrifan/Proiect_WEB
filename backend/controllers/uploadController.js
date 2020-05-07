const HttpStatusCodes = require("http-status-codes");
const uploadFuncs = require("../utils/upload")
const formidable = require("formidable")
const sleep = require("sleep")
exports.upload = async (req,res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
      console.log(files.file.name)
      if (files.file){
        await uploadFuncs.googleUpload(files.file)       
      } 
    });
    res.statusCode = HttpStatusCodes.OK
    res.setHeader('Content-Type', 'application/json')
    return res.write(JSON.stringify({success: true, message: 'Successfully upload'}))
  } catch (error) {
    console.error(error)
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({success: false, message: 'Something bad happend'}))
  }
}

