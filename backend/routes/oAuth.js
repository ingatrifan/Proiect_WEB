const  { Router } = require("./router")
const { oAuthController } = require("../controllers")
const router = new Router();

router.registerEndPoint('GET','authorize/dropbox', oAuthController.dropboxAuth);
router.registerEndPoint('GET','authorize/google', oAuthController.googleAuth);
router.registerEndPoint('GET','authorize/onedrive', oAuthController.oneDriveAuth);

module.exports = {
    router
};