const models = require('../models/index');
const utilities = require('./oauth/authorize/utilityIndex');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'SUPER_SECRET_KEY';
const url = require('url');
const validation = require('../utils/checkValidation');

exports.verifyExistingTokensController = async (req,res) => {
  let uri = url.parse(req.url).query;
  let values = uri.split('=');
  let token = values[1];

  if(validation.checkValidation(token,res) == false) {
    return;
  } else {
      let authValues = jwt.decode(token,PRIVATE_KEY);
      await models.User.findOne({email: authValues.user},async(err,user) => {
        if(!err) {
          let resultJson = {};
          resultJson['google'] = user.googleAuth.accessToken ? true : false;
          resultJson['dropbox'] = user.dropboxAuth.accessToken ? true : false;
          resultJson['onedrive'] = user.oneDriveAuth.accessToken ? true : false;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(resultJson));
          return;
        } else {
          res.setHeader('Content-Type', 'application/json');
          let resultJson = {'error': 'error'};
          res.end(JSON.stringify(resultJson));
          return;
        }
      });
  }
};