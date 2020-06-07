const auth = require('../controllers/index');
const router = require('./router');
const pageHTML = require('../controllers/renderHTML/loginRegister');
const landingPageRender = require('../controllers/renderHTML/renderLandingPage');
const mainPage = require('../routes/mainPage');
const rout = new router.Router();
const url = require('url')
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY_RESET";

rout.registerEndPoint('GET','/register',(req,res)=>{
    pageHTML.renderRegister(req,res);
});

rout.registerEndPoint('GET','/login',(req,res)=>{
    pageHTML.renderLogin(req,res);
});
rout.registerEndPoint('GET','/forgot',(req,res)=>{
    pageHTML.renderLogin(req,res);
})
rout.registerEndPoint('GET','/reset',(req,res)=>{
    let resetToken = url.parse(req.url,true).query.token;
    console.log(resetToken)
    let expired = jwt.verify(resetToken,PRIVATE_KEY);
    console.log(expired)
    if (expired)
        pageHTML.renderLogin(req,res)
    else {
        res.write('Token is expired or invalid');
        res.end();
    }
})

rout.registerEndPoint('GET','/mainPage',(req,res)=>{
    //mainPage.mainPage(req,res);
     pageHTML.renderLogin(req,res);
});

rout.registerEndPoint('GET','/',(req,res)=>{//landing page here
    landingPageRender.landingPage(req,res);
});

rout.registerEndPoint('GET','/about',(req,res)=>{
    pageHTML.renderLogin(req,res);//cuz it's pretty much the same also
});

rout.registerEndPoint('GET','/fileList',(req,res) => {
  mainPage.mainPage(req,res);
});

rout.registerEndPoint('GET','/dashboard',(req,res) => {
  pageHTML.renderLogin(req,res);
});

module.exports={
    rout
};