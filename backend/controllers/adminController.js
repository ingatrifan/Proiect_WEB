const jwt = require('jsonwebtoken');
const url = require('url');
const models = require('../models/index');
const validation = require('../utils/checkValidation');
const PRIVATE_KEY = 'SUPER_SECRET_KEY';

exports.adminController = async (req,res) => {
  let uri = url.parse(req.url).query;
  let values = uri.split('=');
  let token = values[1];

  if(validation.checkValidation(token,res) == false) {
    return;
  } else {
    let authValues = jwt.decode(token,PRIVATE_KEY);
    await models.User.findOne({email: authValues.user},async(err,user)=> {
      if(!err) {
          res.setHeader('Content-Type', 'application/json');
          let resultJson = {'admin' : user.isAdmin ? true : false};
          console.log(user);
          res.end(JSON.stringify(resultJson));
          return;
      }
      else {
        res.setHeader('Content-Type', 'application/json');
        let resultJson = {'error' : 'MongoDB error'};
        res.end(JSON.stringify(resultJson));
        return;
      }
    });
  }
};