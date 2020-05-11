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
    router
};