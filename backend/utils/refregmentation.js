const fs = require('fs');
const path = require('path');
async function refragmentation(fragments,usedId,fileName){
    return new Promise(async (resolve)=>{
    let fileTmpPath= path.join(process.cwd(),'tmp',usedId,fileName);
    let fileOut = await fs.openSync(fileTmpPath, 'w')
    fragments.sort((a,b)=>a.p1-b.p1);
    for(i in fragments){
        let content= await fs.readFileSync(fragments[i].filePath);
        let buff = Buffer.from(content);
        await fs.writeSync(fileOut,buff,0,buff.length,fragments[i].p1) ;
    }
    fs.closeSync(fileOut);
        resolve(fileTmpPath);
    });
}

module.exports={
    refragmentation
}