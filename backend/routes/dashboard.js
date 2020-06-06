const router = require('./router');
const { dashboardInfoController } = require('../controllers/dashboardController');
const { adminController } = require('../controllers/adminController');
const dashRouter = new router.Router();

dashRouter.registerEndPoint('GET','/userInfo',dashboardInfoController);
dashRouter.registerEndPoint('GET','/verifyAdmin', adminController);

module.exports={
  dashRouter
};