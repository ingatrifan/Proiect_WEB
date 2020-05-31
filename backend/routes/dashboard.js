const router = require('./router');
const { dashboardInfoController } = require('../controllers/dashboardController');

const dashRouter = new router.Router();

dashRouter.registerEndPoint('GET','/userInfo',dashboardInfoController);

module.exports={
  dashRouter
};