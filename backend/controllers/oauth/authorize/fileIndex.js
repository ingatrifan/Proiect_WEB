const dropboxFileController= require('./dropbox/dropboxFileController');
const googleFileController= require('./google/googleFileController');
const onedriveFileController=require('./onedrive/onedriveFileController');

module.exports={
    dropboxFileController,googleFileController,onedriveFileController
};