const path = require('path');
const url = require('url');
const fs = require('fs');
const mimetypes = {
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
    'svg': 'image/svg+xml'
};

pageRendering = async (req,res) => {
    var uri = url.parse(req.url).pathname;
    var filename ;
    filename = path.join(process.cwd(),'views',unescape(uri));
    var loadFile;
    try{
        loadFile =fs.lstatSync(filename);
    }
    catch(err){
        res.writeHead(404, {
            "Content-Type": 'text/plain'
        });
        res.write('404 Internal Error');

        res.end();
        return;
    }
    if(loadFile.isFile())
    {
        var mimetype= mimetypes[path.extname(filename).split('.').reverse()[0]];
        res.writeHead(200,{'Content-Type':mimetype});
        var filestream = fs.createReadStream(filename);
        filestream.pipe(res);
        
    }
    else if(loadFile.isDirectory()){
        res.writeHead(302, {
            'Location': 'landingPage.html'
        });
        res.end();
    }

}
module.exports={
    pageRendering

};

