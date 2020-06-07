const dotenv=  require('dotenv');
const config =dotenv.config({
    path: './config/config.env'}).parsed;

function getIP(host){
    if(host==config.IP_LOCAL_1){
        return config.IP_LOCAL_1;
    }else if (host == config.IP_LOCAL_2)
    {
        return config.IP_LOCAL_2;
    }
    return config.IP_EXTERN;
}
module.exports={
    getIP
}