const auth = require('./auth');
const {Router} = require('./router');
const upload = require('./upload');
const router = new Router();;
router.use('',auth.rout);
router.use('',upload.router);

module.exports={
    router
};