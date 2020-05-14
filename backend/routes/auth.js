const auth = require('../controllers/index');
const router = require('./router');

const rout = new router.Router();
rout.registerEndPoint("POST","/login",(req,res)=>{
    auth.loginController.login(req,res);
});
rout.registerEndPoint("POST","/register",(req,res)=>{
    auth.registerController.register(req,res);

});
rout.registerEndPoint("POST","/validateToken",(req,res)=>{
    auth.tokenVerifier.tokenVerify(req,res);
});
rout.registerEndPoint('GET','/googleAuth',(req,res)=>{
    res.write('Hello there');
    res.end();
  });

module.exports={
    rout
};