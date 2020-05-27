const fs = require('fs');
const path = require('path');
const url = require('url');

async function landingPage(req,res){
    var uri = url.parse(req.url).pathname;
    let filename = path.join(process.cwd(),'views/pages','landingPage.html');
    console.log(filename);
    let loadFile;
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
        res.writeHead(200,{'Content-Type':'text/html'});
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
    landingPage
}