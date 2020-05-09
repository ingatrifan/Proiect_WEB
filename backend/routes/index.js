const  { Router } = require("./router")
const router = new Router();
const { uploadController, downloadController } = require("../controllers")

process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});

router.registerEndPoint("POST","/upload",uploadController.upload)

module.exports = {
    router
};

router.registerEndPoint('GET','/download',downloadController.download);