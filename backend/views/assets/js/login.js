


function login (e){
    //get id and pass , must also do enc
    const url = 'http://'+window.location.host+'/login';
    let id = document.getElementById('user_id');
    let pw = document.getElementById('user_pass');

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
  
  function isEmailValid(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    else {
      return false;
    }
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

