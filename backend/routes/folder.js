const  { Router } = require("./router")
const router = new Router();
const { folderController } = require('../controllers');

process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});

router.registerEndPoint("GET","/createFolder",(req,res)=>{
    folderController.createFolder(req,res)
});
router.registerEndPoint("GET","/folderParent",(req,res)=>{
    folderController.getFolderParent(req,res)
});


module.exports = {
    router
};