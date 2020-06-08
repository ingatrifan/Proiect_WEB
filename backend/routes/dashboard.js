const router = require('./router');
const { dashboardInfoController, deleteUser } = require('../controllers/dashboardController');
const { adminController } = require('../controllers/adminController');
const dashRouter = new router.Router();

dashRouter.registerEndPoint('GET','/userInfo',dashboardInfoController);
dashRouter.registerEndPoint('GET','/verifyAdmin', adminController);
dashRouter.registerEndPoint('DELETE' , '/deleteUser', deleteUser);

module.exports={
  dashRouter
};