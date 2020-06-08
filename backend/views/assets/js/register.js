const url = 'http://'+window.location.host+'/register';
let errorMsg = document.getElementById('errorMsg')
let form = document.getElementById("registerForm");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

function register(){
    let email = document.getElementById('email');
    let pw1 = document.getElementById('userPass1');
    let pw2 = document.getElementById('userPass2');
    let name = document.getElementById('name');
    if (pw1.value != pw2.value){
        console.log(pw1.value);
        errorMsg.innerHTML = "Passwords doesn't match";
        errorMsg.style.color = "red";
        return;
    }
    let data = JSON.stringify({
            "email" :  email.value,
            "password" : pw1.value,
            "name" : name.value
        });
    postData(url,data,function(succ){
        window.location.replace('http://'+window.location.host+'/login'); 
    });
}

function postData(url,data,succes){
    // an encoding required
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST',url,true);
    httpRequest.onreadystatechange= function(){
        if(httpRequest.readyState===httpRequest.DONE && httpRequest.status == 201)
        {
            succes(httpRequest.responseText);
        } else
        if(httpRequest.readyState===httpRequest.DONE && httpRequest.status == 409)
        {
            message = JSON.parse(httpRequest.responseText)
            errorMsg.innerHTML = message.message;
            errorMsg.style.color = "red";
        }
    };
    httpRequest.setRequestHeader('Content-Type', 'plaint/text');
    httpRequest.send(data);
}

// window.onresize = resize;

// function resize() {
//   let headerRight = document.getElementsByClassName('header-right')[0];
//   let collapseButton = document.getElementById('collapse-header');
//   let expandButton = document.getElementById('expand-header');

//   if (window.innerWidth >500 ){
//     collapseButton.style.display = 'none';
//     expandButton.style.display = 'none';
//     headerRight.style.display = 'block';
//   }
//   else {
//     expandButton.style.display = 'block';
//     headerRight.style.display = 'none';
//     collapseButton.style.display = 'none';
//   }
// }
