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
                dataType.googleAuth.lastAccessed=new Date();
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
                dataType.oneDriveAuth.lastAccessed=new Date();
                let dataRefreshed = await auth.onedriveAuth.refreshAccesstoken(dataType.oneDriveAuth.refreshToken);
                dataType.oneDriveAuth.accessToken=dataRefreshed.access_token;
                dataType.oneDriveAuth.refreshToken=dataRefreshed.refresh_token;
                await models.User.updateOne({email:dataType.email},{oneDriveAuth:dataType.oneDriveAuth})
            }
        }
        return dataType;
    }else{
        let currDate =  new Date().getTime();
        
        let fragments = dataType.fragments;
        let update=false;
        for(let i =0;i<fragments.length;i++){
            if(fragments[i].name=='google'){
                let dbDate = fragments[i].lastAccessed.getTime();
                if(currDate-dbDate>3000){
                    update =true;
                    fragments[i].lastAccessed=new Date();
                    let dataRefreshed = await auth.googleAuth.refreshAccessToken(fragments[i].refreshToken);
                    fragments[i].accessToken=dataRefreshed.access_token;
                }
            }
            if(fragments[i].name=='onedrive'){
                
                let dbDate=fragments[i].lastAccessed.getTime();
                if(currDate-dbDate>3000){
                    update =true;
                    fragments[i].lastAccessed=new Date();
                    let dataRefreshed = await auth.onedriveAuth.refreshAccesstoken(fragments[i].refreshToken);
                    fragments[i].accessToken=dataRefreshed.access_token;
                    fragments[i].refreshToken=dataRefreshed.refresh_token;
                }
            }
        }
        if(update){
            models.File.updateOne({id_file:dataType.id_file,id_user:dataType.id_user},{
                fragments:fragments
            }).then(()=>console.log('updated'));
        }
        dataType.fragments=fragments;
        return dataType;
    }
    
}

module.exports= {
    refreshTokens
}