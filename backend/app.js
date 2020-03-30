//for demonstrative purposes
const http = require('http');
const url = require('url');
const httpStatusCode = require('http-status-codes');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Mongo connection
mongoose
  .connect("mongodb+srv://admin:admin@twproject-skgsk.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("successfully connected to database"));

//accesing models
const db = require("./models");
//accesing controllers
const controllers = require("./controllers");
//controllers.authController.login()


const endpointUtils = require('./routes/endpoint_utilities');

//testing database connection
const testDatabase = async()=>{
    const user = await db.User.create({email:"first",password:"second"});
    console.log(user);
    const file = await db.File.create({name:"file1",path:"foof.com"});
    console.log(file);
}
//testDatabase();

const server =http.createServer( (req,res)=>{
    try {
        let reqUrlString = req.url;
        let pathName = url.parse(reqUrlString,true,false);
        let method = req.method;
        let handler = endpointUtils.getHandler(method,pathName);
        handler(req,res);
    }catch(err) {
        res.statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
        res.end();
    }   
});

process.on("uncaughtException",(err) =>{
    console.log("Caught error",err);
});

const PORT = 3000;
server.listen(PORT);
console.log('Listening on port: ',PORT);


