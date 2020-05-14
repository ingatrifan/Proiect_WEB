const  { Router } = require("./router")
const router = new Router();
const fileRouter = require('./file');
const authRouter = require('./auth')
const oauthAuthorizeRouter = require('./oAuth')
const test = require('./pagesRouter');
process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});
router.use('',fileRouter.router)
router.use('',authRouter.rout)
router.use('',oauthAuthorizeRouter.router)
router.use('',test.rout);

module.exports = {
    router
};