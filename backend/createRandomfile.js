const fs = require('fs');




var w = 0;
let len=0;
let data = fs.openSync('./sample.txt','w');
for (let i =0 ;i<1_000;i++){
    let buffer = i.toString();
    fs.writeSync(data,buffer,len,buffer.length);
    len = len+buffer.length;
    console.log(len);
}
fs.closeSync(data);