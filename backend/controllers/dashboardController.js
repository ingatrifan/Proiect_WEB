const models = require('../models/index');
const utilities = require('./oauth/authorize/utilityIndex');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'SUPER_SECRET_KEY';
const url = require('url');
const validation = require('../utils/checkValidation');

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

exports.dashboardInfoController = async (req,res) => {
  let uri = url.parse(req.url).query;
  let values = uri.split('=');
  let token = values[1];
  if(validation.checkValidation(token,res) == false) {
    return;
  } else {
      let authValues = jwt.decode(token,PRIVATE_KEY);
      await models.User.findOne({email: authValues.user},async(err,user)=> {
        if(!err) {
          if(!user.isAdmin) {
            res.setHeader('Content-Type', 'application/json');
            let resultJson = {'error': 'error'};
            res.end(JSON.stringify(resultJson));
            return;
          }
          else {
            let resultJson = [];
            await models.User.find(async(err,users) => {
              if(!err) {

                for(let i = 0; i < users.length; i++) {
                  let userData = {};
                  userData['email'] = users[i].email;
                  userData['admin'] = users[i].isAdmin;
                  if(users[i].googleAuth.authorized) {
                    let userToken = users[i].googleAuth.accessToken;
                    let data= await utilities.google.getDriverInfo(userToken);
                    if(data.error) {
                      userData['google'] = -1;
                    }else {
                      userData['google'] = `${formatBytes(data.storageQuota.usage)} / ${formatBytes(data.storageQuota.limit)}`;
                    }
                  }else {
                    userData['google'] = -1;
                  }

                  if(users[i].dropboxAuth.authorized) {
                    let userToken = users[i].dropboxAuth.accessToken;
                    let data= await utilities.dropbox.getDriverInfo(userToken);
                    //useless, solve later with everyone
                    if(data.error) {
                      userData['dropbox'] = -1;
                    }else {
                      userData['dropbox'] = `${formatBytes(data.used)} / ${formatBytes(data.allocation.allocated)}`;
                    }
                  }else {
                    userData['dropbox'] = -1;
                  }

                  if(users[i].oneDriveAuth.authorized) {
                    let userToken = users[i].oneDriveAuth.accessToken;
                    let data= await utilities.onedrive.getDriverInfo(userToken);
                    //useless, solve later with everyone
                    if(data.error) {
                      userData['onedrive'] = -1;
                    }else {
                      userData['onedrive'] = `${formatBytes(data.quota.used)} / ${formatBytes(data.quota.total)}`;
                    }
                  }else {
                    userData['onedrive'] = -1;
                  }

                  resultJson.push(userData);
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(resultJson));
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"success": false, "message": 'Error retrieving info from database'}));
              }
            });
          }
        }
      })
    }
};