var  a = new Date();
a.getHours();


setTimeout(()=>{
    var b = new Date();
    console.log(b-a);
},1000);