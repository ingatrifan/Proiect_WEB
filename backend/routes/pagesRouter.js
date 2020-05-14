const auth = require('../controllers/index');
const router = require('./router');
const pageHTML = require('../controllers/renderHTML/loginRegister');
const mainPage = require('../routes/mainPage');
const rout = new router.Router();

rout.registerEndPoint('GET','/register',(req,res)=>{
    pageHTML.renderRegister(req,res);
});

rout.registerEndPoint('GET','/login',(req,res)=>{
    pageHTML.renderLogin(req,res);
});

rout.registerEndPoint('GET','/mainPage',(req,res)=>{
    mainPage.mainPage(req,res);
});

rout.registerEndPoint('GET','/landingPage',(req,res)=>{
    pageHTML.renderLogin(req,res);// cuz it's pretty much the same
});

rout.registerEndPoint('GET','/about',(req,res)=>{
    pageHTML.renderLogin(req,res);//cuz it's pretty much the same also
});
module.exports={
    rout
};