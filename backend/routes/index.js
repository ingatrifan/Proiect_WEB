<<<<<<< HEAD
const auth = require('./auth');
const {Router} = require('./router');
const upload = require('./upload');
const router = new Router();;
router.use('',auth.rout);
router.use('',upload.router);

module.exports={
=======
const  { Router } = require("./router")
const router = new Router();
const fileRouter = require('./file');
const authRouter = require('./auth')
process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});
router.use('',fileRouter.router)
router.use('',authRouter.rout)

module.exports = {
>>>>>>> origin/master
    router
};