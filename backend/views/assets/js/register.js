const url = 'http://'+window.location.host+'/register';


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
        window.location.replace('http://'+window.location.host+'/login')
    });
}

function isEmailValid(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  else {
    return false;
  }
}

function validateEmailField() {
  let emailElement = document.getElementById('user_id');
  let errorMsg = document.getElementById('error');
  if (isEmailValid(emailElement.value)) {
    errorMsg.classList.add('invisible');
  } else {
    if(emailElement.value != '') {
      errorMsg.classList.remove('invisible');
    }
    else {
      errorMsg.classList.add('invisible');
    }
  }
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
