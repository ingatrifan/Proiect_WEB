const curl = require('node-libcurl')

module.exports= function(){
    this.curl = new curl.Curl()
    this.setCurl =(curl_c) =>{this.curl=cur_c;return this};

    this.call_back =()=>{
        return new Promise((res,rej)=>{
            

            try{


            }catch(e){
                
            }
        });
    }
    return this;

};