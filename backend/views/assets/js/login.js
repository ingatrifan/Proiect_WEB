


function login (e){
    //get id and pass , must also do enc
    const url = 'http://localhost:3000/login';
    let id = document.getElementById('user_id');
    let pw = document.getElementById('user_pass');
    console.log(id.value,pw.value);

    let encodeString  = id.value +':'+pw.value;
    //encoding
    encodeString = btoa(encodeString);  
    let data = JSON.stringify(
        {
            "encode": encodeString
        });
    postData(url,data,function(succ){
        var json = JSON.parse(succ.responseText);
        localStorage.setItem('serverToken',json.serverToken);
        console.log(succ.responseText);
        location = json.location;
    });
    return false;
   }


function postData(url,data,succes){
    // an encoding required
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST',url,true);
    httpRequest.onreadystatechange= function(){
        if(httpRequest.readyState===httpRequest.DONE && httpRequest.status ==200)
        {
            succes(httpRequest);            
        } 
    };
    httpRequest.setRequestHeader('Content-Type', 'text/plain');
    httpRequest.send(data);
}

