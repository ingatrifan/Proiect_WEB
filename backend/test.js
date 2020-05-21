var convertHex = require('convert-hex')
function unpack(str) {
    var bytes = [];
    for(var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
    }
    return bytes;
}
function bin2string(array){
	var result = "";
	for(var i = 0; i < array.length; ++i){
		result+= (String.fromCharCode(array[i]));
	}
	return result;
}
let a = 'ABC';
let b = Buffer.from(a).toString('hex');
let c = Buffer.from(b);
let d = c.toString()

let e = Buffer.from(d,'hex').toString();
console.log(e);
