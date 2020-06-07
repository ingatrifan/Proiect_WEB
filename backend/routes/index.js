const  { Router } = require("./router")
const router = new Router();
const fileRouter = require('./file');
const authRouter = require('./auth')
const oauthAuthorizeRouter = require('./oAuth')
const pageRouter = require('./pagesRouter');
const dashRouter = require('./dashboard');

process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});
router.use('',fileRouter.router)
router.use('',authRouter.rout)
router.use('',oauthAuthorizeRouter.router)
router.use('',pageRouter.rout);
router.use('',dashRouter.dashRouter);

module.exports = {
    router
};