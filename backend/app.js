//for demonstrative purposes
const http = require('http');
const url = require('url');

const endpointUtils = require('./controllers/routes/endpoint_utilities');

const server =http.createServer( (req,res)=>{
    try {
        let reqUrlString = req.url;
        let pathName = url.parse(reqUrlString,true,false);
        let method = req.method;
        let handler = endpointUtils.getHandler(method,pathName);
        handler(req,res);
    }catch(err) {
        res.statusCode = 500;
        res.end();
    }   
});

process.on("uncaughtException",(err) =>{
    console.log("Caught error",err);
});

const PORT = 3000;
server.listen(PORT);
console.log('Listening on port: ',PORT);


