const  { Router } = require("./router")
const router = new Router();
const { uploadController } = require("../controllers")

process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});

router.registerEndPoint("POST","/upload",uploadController.upload)


router.registerEndPoint('GET', '/ex', function (req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({success: true, message: 'example ran successfully'}))
});
module.exports = {
    router
};