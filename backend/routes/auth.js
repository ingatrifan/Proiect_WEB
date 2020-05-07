const auth = require('../controllers/index');
const router = require('./router');

const rout = new router.Router();
rout.registerEndPoint("POST","/login",(req,res)=>{
    auth.loginController.login(req,res);
});
rout.registerEndPoint("POST","/register",(req,res)=>{
    auth.loginController.register(req,res);
});

module.exports={
    rout
};