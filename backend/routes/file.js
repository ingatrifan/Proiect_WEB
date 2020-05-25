const  { Router } = require("./router")
const router = new Router();
const { fileController } = require("../controllers")

process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});

router.registerEndPoint("POST","/upload",fileController.upload)
router.registerEndPoint('DELETE','/delete', fileController.remove)
router.registerEndPoint('GET','/download',fileController.download)

module.exports = {
    router
};