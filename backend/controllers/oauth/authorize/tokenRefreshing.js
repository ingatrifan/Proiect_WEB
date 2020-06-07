const auth = require('./authIndex');
const models = require('../../../models');


async function refreshTokens(dataType){//can be an user or an folder 
    console.log(dataType); 
    //auth.googleAuth.refreshAccessToken();
    //auth.onedriveAuth.refreshAccesstoken();
}

module.exports= {
    refreshTokens
}