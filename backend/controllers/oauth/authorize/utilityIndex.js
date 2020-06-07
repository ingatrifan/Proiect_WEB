const dropbox = require('./dropbox/utilityFunctions');
const onedrive = require('./onedrive/utilityFunctions');
const google = require('./google/utilityFunctions');
const tokenRefresher = require('./tokenRefreshing');
const validateFiles = require('./validateFiles');
module.exports={
    dropbox,onedrive,google,tokenRefresher,validateFiles
}
