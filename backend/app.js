
//libs
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


//built in
const rendering = require('./routes/pageRendering');
const controllers = require('./controllers/index');
const models = require('./models/index');


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

const port = 3000;
const server = http.createServer((req, res) => {
  //FOR SOME ERRORS 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    if(req.method==='GET'){
      rendering.pageRendering(res,req);
    }
    else if(req.method==='POST')
    {
      var pathUrl = url.parse(req.url).pathname.split('/').reverse()[0];
      if(pathUrl =='login')
      {
        controllers.login.login(req,res);
      }
      else if(pathUrl=='register'){
        controllers.register.register(req,res);
        //handle register
      }
      

    }
    else{
      res.statusCode=404;
      res.end();
    }
});

server.listen(config.PORT, config.HOSTNAME, () => {
  console.log(`Server running at http://${config.HOSTNAME}:${config.PORT}`);
});