const errorMsg = document.getElementById('errorMsg');

function login(e){
    const url = 'http://'+window.location.host+'/login';
    let email = document.getElementById('email');
    let pw = document.getElementById('password');

    let encodeString  = email.value +':'+pw.value;
    encodeString = btoa(encodeString);  
    let data = JSON.stringify({
        "encode": encodeString
    });
    postData(url,data,function(succ){
        var json = JSON.parse(succ.responseText);
        localStorage.setItem('serverToken',json.serverToken);
        location = json.location;
    });
    return;
}

function forgotPass(){
    const url = 'http://'+window.location.host+'/forgot';
    let email = document.getElementById('email');
    let data = JSON.stringify({
            "email": email.value
    });
    postData(url,data,function(succ){
        location.replace('http://'+window.location.host+'/')
    });
    return;
}
function resetPass(){
    const url = 'http://'+window.location.host+'/reset';
    let pass = document.getElementById('password');
    let repPass = document.getElementById('repPassword');
    if (pass.value != repPass.value){
        errorMsg.innerHTML = 'Password do not match';
        errorMsg.style.color = 'red';
        return;
    }
    let currentUrl = window.location.href;
    let parser = document.createElement('a');
    parser.href = currentUrl;
    let resetToken = parser.search.split('=');
    console.log(resetToken[1])
    let data = JSON.stringify(
        {
            "token": resetToken[1],
            "password": pass.value
        });
    postData(url,data,function(succ){
        location.replace('http://'+window.location.host+'/')
    });
    return;
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
        if(httpRequest.readyState===httpRequest.DONE && httpRequest.status !=200)
        {
            message = JSON.parse(httpRequest.responseText)
            errorMsg.innerHTML =  message.message;
            errorMsg.style.color = "red";          
        } 
    };
    httpRequest.setRequestHeader('Content-Type', 'text/plain');
    httpRequest.send(data);
}

window.onresize = resize;

function resize() {
  let headerRight = document.getElementsByClassName('header-right')[0];
  let collapseButton = document.getElementById('collapse-header');
  let expandButton = document.getElementById('expand-header');

  if (window.innerWidth >500 ){
    collapseButton.style.display = 'none';
    expandButton.style.display = 'none';
    headerRight.style.display = 'block';
  }
  else {
    expandButton.style.display = 'block';
    headerRight.style.display = 'none';
    collapseButton.style.display = 'none';
  }
}

