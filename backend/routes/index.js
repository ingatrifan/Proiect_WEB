const  { Router } = require("./router")
const router = new Router();
const fileRouter = require('./file');
const authRouter = require('./auth')
const oauthAuthorizeRouter = require('./oAuth')

process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});
router.use('',fileRouter.router)
router.use('',authRouter.rout)
router.use('',oauthAuthorizeRouter.router)

module.exports = {
    router
};

router.registerEndPoint('GET','/download',downloadController.download);