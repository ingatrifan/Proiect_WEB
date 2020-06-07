const auth = require('../controllers/index');
const router = require('./router');
const verify = require('../controllers/verifyExistingTokensController')

const rout = new router.Router();
rout.registerEndPoint("POST","/login",(req,res)=>{
    auth.loginController.login(req,res);
});
rout.registerEndPoint("POST","/register",(req,res)=>{
    auth.registerController.register(req,res);

});
rout.registerEndPoint("GET","/confirm",(req,res)=>{
    auth.forgotController.confirmAccount(req,res)
})
rout.registerEndPoint("POST","/forgot",(req,res)=>{
    auth.forgotController.forgotPassword(req,res)
})
rout.registerEndPoint("POST",'/reset',(req,res)=>{
    auth.forgotController.resetPassword(req,res)
})
rout.registerEndPoint("POST","/validateToken",(req,res)=>{
    auth.tokenVerifier.tokenVerify(req,res);
});
rout.registerEndPoint('GET','/googleAuth',(req,res)=>{
    res.write('Hello there');
    res.end();
  });

rout.registerEndPoint('GET','/verifyExistingTokens', verify.verifyExistingTokensController);

module.exports={
    rout
};