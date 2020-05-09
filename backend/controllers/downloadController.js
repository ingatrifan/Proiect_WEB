const HttpStatusCodes = require("http-status-codes");
const downloadUtils = require("../utils/upload");

exports.download = async (req,res) => {
  try {
    console.log('downloading...');
    await downloadUtils.dropboxDownload(null); 
    res.statusCode = HttpStatusCodes.OK
    res.setHeader('Content-Type', 'application/json')
    return res.end();
  }catch(err) {
    console.error(error);
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({success: false, message: 'Something bad happend'}))
  }
}