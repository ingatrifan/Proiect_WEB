const url = 'http://127.0.0.1:3000/register';


function register(){
    let id = document.getElementById('user_id');
    let pw1 = document.getElementById('user_pass1');
    let pw2 = document.getElementById('user_pass2');
    let name = document.getElementById('user_name');
    //logic for different passwords, user id found in data base etc...
    //when to connect 
    let data = JSON.stringify(
        {
            "user_id" :  id.value,
            "user_pass" : pw1.value,
            "user_name" : name.value
        });
    postData(url,data,function(succ){
        console.log(succ);
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
