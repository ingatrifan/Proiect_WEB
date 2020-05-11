
//libs
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//built in
const  {Router}  = require('./routes/router');
const {HTTPServer} = require('./utils/server');
const models = require('./models/index');
<<<<<<< HEAD
const routes= require('./routes/index');

=======
const index = require('./routes')
>>>>>>> origin/master


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
    email:'test',
    name :'test',
    password :'asdf'
  });
  b.save(function(){
    console.log("inserted test rat");
  });
}
connectDB();
const router = new Router();
<<<<<<< HEAD
router.use('',routes.router);
=======
router.use('',index.router)
>>>>>>> origin/master
const app = new HTTPServer(router);
app.listen();