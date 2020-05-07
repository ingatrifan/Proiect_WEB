
//libs
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const httpStatusCode = require('http-status-codes');

const dotenv = require('dotenv');
const mongoose = require('mongoose');

//built in
const { Router } = require('./routes/router');
const {HTTPServer} = require('./utils/server');
const models = require('./models/index');
const index = require('./routes')


//configuration
const config =dotenv.config({
  path: './config/config.env'}).parsed;
//connect db
//NOTE: ADD YOUR IP ADDRESS TO MONGO DB 
async function connectDB(){
  await mongoose.connect(config.MONGO_URI,
    {
      useNewUrlParser:true,
      useUnifiedTopology:true
  }).then(()=>console.log("Connected to DB")).catch((err)=>{
    console.log(err);
  })
  //Line command that should be deleted some day
  await models.User.remove({},()=>console.log("Cleaning testing"));
  //adding test user 
  let b = new models.User({
    email:'test@gmail.com',
    name :'test',
    password :'asdf'
  });
  b.save(function(){
    console.log("inserted test rat");
  });
}
connectDB();

const bla = require('./controllers/index');

router.registerEndPoint('GET', '/ex', function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({success: true, message: 'example ran successfully'}));
    res.end();
});
router.registerEndPoint('POST', '/register', function (req, res) {
  bla.register.register(req,res);
});
router.registerEndPoint('POST','/login',(req,res)=>{
  //res.setHeader('Content-Type', 'application/json');
  //console.log("Here");
  //bla.login.login(req,res);
  //res.statusCode = 200;
  //res.setHeader('Content-Type', 'application/json');
  bla.login.login(req,res);
  //res.write(JSON.stringify({success: true, message: 'example ran successfully'}));
});
router.use('',index.router);

/*router.registerEndPoint('OPTIONS','/login',(req,res)=>{

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Access-Control-Allow-Headers': '*'
  };
  
    res.writeHead(204, headers);
    res.end();
});*/

/*router.registerEndPoint('OPTIONS','/register',(req,res)=>{

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Access-Control-Allow-Headers': '*'
  };
  
    res.writeHead(204, headers);
    res.end();
});*/

process.on("uncaughtException", (err) => {
  console.log("Caught error", err);
});

const app = new HTTPServer(router);
app.listen();