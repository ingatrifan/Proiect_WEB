const { Router } = require('./routes/router');
 
const router1 = new Router();

router1.registerEndPoint('GET','/about',(req,res)=>{
    console.log('Working!');
});

const router2 = new Router();

router2.registerEndPoint('GET','/hello',(req,res)=>{
    console.log("Working2");
});

router2.registerEndPoint('POST','/hello',(req,res)=>{
    console.log("Working2post");
});

router1.use('',router2);

let handler = router1.getHandler('POST','/hello')();