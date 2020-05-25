// Get DOM Elements
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector("#modal-btn");
const closeBtn = document.querySelector('.close');
const burger = document.getElementById("burger");
const arrowBack = document.querySelector(".back-arrow");
const bar = document.querySelector(".bar");
const sidepart = document.querySelector(".sidepart");
const headerRight = document.getElementsByClassName('header-right')[0];
const collapseButton = document.getElementById('collapse-header');
const expandButton = document.getElementById('expand-header');
// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click',closeModal);
window.addEventListener('click',outsideClick);
burger.addEventListener('click',openSidepart);
arrowBack.addEventListener('click',back);
window.onresize = resize;
function resize() {
    if (window.innerWidth >730 ){
        bar.style.display = 'none';
        sidepart.style.display = 'inline-block';
    } else {
        bar.style.display = 'inline-block';
        sidepart.style.display = 'none';
    }

    //for header
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
  

function openSidepart(){
    bar.style.display = 'none';
    sidepart.style.display = 'inline-block';
}
function back(){
    bar.style.display = 'inline-block';
    sidepart.style.display = 'none';
}
// Open
function openModal() {
  modal.style.display = 'block';
}

// Close
function closeModal() {
  modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

function reply_click(clicked_id)
{
    alert(clicked_id);
}

const form =document.getElementById('form_action');
form.enctype="multipart/form-data"
function handleForm(event) { 
  event.preventDefault(); 
  const formData = new FormData();
  let files = document.querySelector('[type=file]');  
  let file = files.files[0];
  
  formData.append('file',file);
  formData.append('serverToken',localStorage.getItem('serverToken'));
  const url = 'http://localhost:3000/upload';
  fetch(url,
    {
      method:'POST',
      body:formData
    }).then(response=>
      //refresh 
      response.json()
       // location.reload(true);
      
    ).then((data)=>{
      if(data.success==true){
        window.location=data.location;
      }
    });

} 
form.addEventListener('submit', handleForm);
//action="upload" method="POST" enctype="multipart/form-data"
//Click download
//https://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery
function downloadFile(element){
  const method = "GET";
  const token = localStorage.getItem('serverToken');
  const id = element.id;
  let divId =  document.getElementById(id);
  let fileName = divId.childNodes[3].childNodes[1].innerHTML
  console.log(fileName);
  const url = 'http://127.0.0.1:3000/download?serverToken='+token+'&idFile='+id;
  fetch(url)
  .then(resp=>{
    return resp.blob()})
  .then(blob=>{

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    alert('your file has downloaded!');
  
  }).catch(()=>allert)

}

//CLICK DELETE
function deleteFile(element){
  const url = 'http://127.0.0.1:3000/delete/?id=';
  const method = "DELETE"
  postData(method,url,function(succ){
      console.log(succ);
      //handler when receiving succes
  });
}
//function GOOLE
function googleAuth(){
  let url = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http%3A//localhost:3000/authorize/google&client_id=282450647382-g7epadv9ud6slg873pm75gmhinhqjsao.apps.googleusercontent.com"
  url+='&state='+ localStorage.getItem('serverToken');
  window.location.replace(url);
}
//function ONEDRIVE
function oneDriveAuth(){
  let url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=03f8e27d-7b57-4b58-a096-3887fc515d43&response_type=code&redirect_uri=http://localhost:3000/authorize/onedrive&response_mode=query&scope=openid offline_access Files.ReadWrite.All";
  url+='&state='+ localStorage.getItem('serverToken');
  window.location.replace(url);
}
//function DROPBOX
function dropboxAuth(){
  let url = 'https://www.dropbox.com/oauth2/authorize?client_id=zfxu0qci4k2cofb&response_type=code&redirect_uri=http://localhost:3000/authorize/dropbox'
  url+='&state='+ localStorage.getItem('serverToken');
  window.location.replace(url);
}

function postData(method,url,succes){
  // an encoding required
  var httpRequest = new XMLHttpRequest();
  httpRequest.open(method,url,true);
  httpRequest.onreadystatechange= function(){
      if(httpRequest.readyState===httpRequest.DONE && httpRequest.status ==200)
      {
          succes(httpRequest.responseText);
          
      } 
  };
  httpRequest.setRequestHeader('Content-Type', 'plaint/text');
  httpRequest.send();
}

