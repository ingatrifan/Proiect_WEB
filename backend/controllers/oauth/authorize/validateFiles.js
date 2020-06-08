

async function  validateFiles(file,utilities){
    return new Promise(async resolve=>{
    let fragments= file.fragments;
    for( let i =0 ;i<fragments.length;i++){
        if(fragments[i].name=='google'){
            let data = await utilities.google.getFileData(fragments[i].accessToken,fragments[i].idFile);
            if(data.statusCode!=200)
            resolve(false)
        }
        if(fragments[i].name=='onedrive'){
            let status = await utilities.onedrive.getFileDataStatus(fragments[i].accessToken,fragments[i].idFile);
            if(status!=200){
                resolve(false)
            }
        }
        if(fragments[i].name=='dropbox'){
            let data = await utilities.dropbox.getFileData(fragments[i].accessToken,fragments[i].idFile);
            if(data.statusCode!=200)
                resolve(false)
        }
    }
    resolve(true);
    });
}

module.exports={
    validateFiles
}