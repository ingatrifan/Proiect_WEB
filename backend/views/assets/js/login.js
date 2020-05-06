function login (){
    //get id and pass , must also do enc
    const url = 'http://127.0.0.1:3000/login';
    let id = document.getElementById('user_id');
    let pw = document.getElementById('user_pass');
    let data = JSON.stringify(
        {
            "user_id" :  id.value,
            "user_pass" : pw.value
        });
    postData(url,data,function(succ){
        console.log('here');
        console.log(succ);
        //handler when receiving succes
    });
   }


function postData(url,data,succes){
    // an encoding required
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST',url,true);
    httpRequest.onreadystatechange= function(){
        if(httpRequest.readyState===httpRequest.DONE && httpRequest.status ==200)
        {
            succes(httpRequest.responseText);
        } 
    };
    httpRequest.setRequestHeader('Content-Type', 'plaint/text');
    httpRequest.send(data);
}

