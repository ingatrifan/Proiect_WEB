const HttpStatusCodes = require("http-status-codes");
const appRootPath = require('app-root-path');
const path = require('path');
const { pageRendering } = require("../routes/pageRendering");

exports.landing = async (req,res) => {
  try {
    let landingPath = path.resolve(appRootPath + "/views/pages/landingPage.html");
    // let landingPath = "../views/pages/landingPage.html";
    console.log(landingPath);
    res.statusCode = HttpStatusCodes.OK
    res.setHeader('Content-Type', 'text/html')
    pageRendering(req,res);
    // res.write(JSON.stringify({success: true, message: 'example ran successfully'}))
    // console.log("mmmmmm")
    // fs.readFile(this.landingPath);
    // console.log("mmmmmm")
    // console.log(html);
    // res.write(html);
    // fs.createReadStream(landingPath).pipe(res);

    fs.readFile(landingPath, "binary", function(err, file) {
        if(err) {        
          res.writeHead(500, {"Content-Type": "text/plain"});
          res.write(err + "\n");
          res.end();
          return;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(file, "binary");
        res.end();
      });
  } catch (error) {
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    res.write("Something bad happend!");
  }
};
