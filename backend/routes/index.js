const auth = require('./auth');
const {Router} = require('./router');

const router = new Router();;
router.use('',auth.rout);

module.exports={
    router
};