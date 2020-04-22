const  { Router } = require("./router")
const router = new Router();
const { pageController } = require("../controllers")
const {pageRendering } = require("./pageRendering")

process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});

router.registerEndPoint('GET', '/ex', function (req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({success: true, message: 'example ran successfully'}))
});
router.registerEndPoint('GET','/landingPage.html',pageRendering)
router.registerEndPoint('GET','/login.html',pageRendering)
router.registerEndPoint('GET','/register.html',pageRendering)



module.exports = {
    router
};