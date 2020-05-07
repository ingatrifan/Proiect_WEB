const auth = require('../controllers/index');
const router = require('./router');

const rout = new router.Router();
rout.registerEndPoint("POST","/login",(req,res)=>{
    auth.test(req,res);
});
rout.registerEndPoint("POST","/register",auth.register);

module.exports={
    rout
};