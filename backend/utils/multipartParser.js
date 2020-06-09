const path = require('path');
const uniqid = require('uniqid');
const HttpStatusCodes = require("http-status-codes");
const fs = require('fs');

function multiPartParse(req,res){
    return new Promise(async (resolve,reject)=>{
        var boundry = getBoundary(req.headers);
        let filePath = path.join(process.cwd(),'tmp',uniqid());
        let stream = fs.createWriteStream(filePath);
        let multipart = new MultiPartParser(boundry,stream,filePath);
        req.on('data',(data)=>{
            multipart.parseBuffer(data);
        });
        req.on('end',()=>{
            stream.end();
            if(boundry ==false){
                res.writeHead(HttpStatusCodes.BAD_REQUEST, {"Content-Type": "application/json"});
                res.write("missing boundary in content-type" );
                res.end();
                reject("missing boundary in content-type");
            }
            resolve(multipart.getParams())
            
        });
    });
}
function getBoundary(header){    
    if(header.toString().search('content-type')==-1&&header['content-type'].indexOf('boundary=')<=-1)
        return false;
    var parts = header['content-type'].split('boundary=');
    var boundary = parts[1];
    return boundary;
}

class MultiPartParser {
    endNotify=false;
    boundry='';
    stream;
    header;
    serverToken;
    currentChunk=0;
    fileName='';
    sum=0;
    filePath;
    constructor(boundry,stream,filePath){
        this.boundry = boundry;
        this.stream = stream;
        this.filePath=filePath;
        return this;
    }
    getParams(){
        let params ={
            filePath:this.filePath,
            serverToken:this.serverToken,
            fileName:this.fileName,
            size:this.sum
        };
        return params;
    }
    parseBuffer(buffer){
        var pos = 0;
        var nextPos;
        var  endState=false;
        while(endState==false){ 
            pos = buffer.indexOf(Buffer.from(this.boundry),pos);
            if(pos!=-1){
                pos = pos +this.boundry.length;  
            }

            if(buffer.toString().substring(pos,pos+2)=='--'){//end case
                return;
            }
            if((nextPos=buffer.indexOf(Buffer.from(this.boundry),pos))==-1){//get pos,nextPos interval
                nextPos = buffer.length;
            }
            else
                nextPos = nextPos-4;
        
            let dataHeader=0;
            if(pos!=-1){
                 dataHeader=  this.parseHeader(buffer.slice(pos,nextPos));
                this.header = dataHeader.header;
                pos = pos +dataHeader.pos;
            }
            
            
            if(this.header=='file'){
                if(this.fileName=='')
                    this.fileName= dataHeader.fileName;
                let start =0;
                if(pos!=-1){
                    start =pos;
                }else{
                    data
                }
                this.sum+=nextPos-start;    
                console.log('ON GOING SUM',this.sum);
                this.stream.write(buffer.slice(start,nextPos));
                if(buffer.indexOf(Buffer.from(this.boundry),pos)==-1)
                    endState = true;

                    //buffer.indexOf(Buffer.from(this.boundry,pos))
                    
            }else if(this.header=='serverToken'){
                this.serverToken = dataHeader.serverToken;
                let bound ='--'+this.boundry;
                let buffBound = Buffer.from(bound);
                let endPos = buffer.indexOf(buffBound);
                this.stream.write(buffer.slice(0,endPos))
                endState=true;  
                this.sum+=endPos;
                console.log('END SUM',this.sum);
            }
        }
    }
    
    parseHeader(buffer){
        let body = buffer.toString().split('name')[1];
        let contentName = body.split('"')[1];
        let fileName;
        let pos =0;
        if(contentName=='file'){
            fileName= buffer.toString().split('filename=')[1].split('"')[1];
            
            pos = buffer.toString().indexOf('\r\n',pos);
            pos = buffer.toString().indexOf('\r\n',pos+1);
            pos = buffer.toString().indexOf('\r\n',pos+1);
            pos = buffer.toString().indexOf('\r\n',pos+1);
            return {pos:pos+2,fileName:fileName,header:"file"};
        }else if(contentName=='serverToken'){
            pos= buffer.toString().indexOf('\r\n',pos);
            pos= buffer.toString().indexOf('\r\n',pos+1);
            return {header:"serverToken",serverToken:buffer.toString().substring(pos,buffer.length)};
        }else
            return -1;
    }
}



module.exports ={
    multiPartParse,MultiPartParser
}