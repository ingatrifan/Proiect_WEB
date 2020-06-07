const auth = require('./authIndex');
const models = require('../../../models');


async function refreshTokens(dataType){//can be an user or an folder 
    if(dataType.email!=null)//user
    {
        let currDate =  new Date().getTime();
        if(dataType.googleAuth.lastAccessed!=null)
        {
            let dbDate = dataType.googleAuth.lastAccessed.getTime();
            if((currDate-dbDate)/1000>3000) //milliseconds
            {
                dataType.googleAuth.lastAccessed=currDate;
                let dataRefreshed = await auth.googleAuth.refreshAccessToken(dataType.googleAuth.refreshToken);
                dataType.googleAuth.accessToken=dataRefreshed.access_token;
               await models.User.updateOne({email:dataType.email},{
                    googleAuth:dataType.googleAuth
                });
            }
        }
        if(dataType.oneDriveAuth.lastAccessed!=null){
            let dbDate = dataType.googleAuth.lastAccessed.getTime();
            if((currDate-dbDate)/1000>3000){
                dataType.oneDriveAuth.lastAccessed=currDate;
                let dataRefreshed = await auth.onedriveAuth.refreshAccesstoken(dataType.oneDriveAuth.refreshToken);
                dataType.oneDriveAuth.accessToken=dataRefreshed.access_token;
                dataType.oneDriveAuth.refreshToken=dataRefreshed.refresh_token;
                await models.User.updateOne({email:dataType.email},{oneDriveAuth:dataType.oneDriveAuth})
            }
        }
        return dataType;
    }else{
        let currDate =  new Date().getTime();


        
        return dataType;
    }
    
}

module.exports= {
    refreshTokens
}