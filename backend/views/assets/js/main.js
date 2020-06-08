// Get DOM Elements
const modal = document.querySelector('#my-modal');
const profileModal = document.querySelector('#profile-modal')
const modalBtn = document.querySelector("#modal-btn");
const deleteModal = document.getElementById('delete-modal')
const deleteFileBtn = document.getElementById('deleteFileBtn');
const searchInput = document.getElementById("search");
const createFolderModal = document.getElementById('createFolderModal');
// Events
modalBtn.addEventListener('click', openModal);
window.addEventListener('click',outsideClick);
window.onload=initMainPage();

function initMainPage(){
  verifyToken();
  getFileInfo();
}


  
function openModal() {
  modal.style.display = 'block';
}
function openConnectModal(){
  profileModal.style.display = 'block';
}
function openCreateFolder(){
  createFolderModal.style.display = "block";
}
function openDeleteModal(element){
  deleteModal.style.display = 'block';
  deleteFileBtn.onclick = function(){ deleteFile(element)};
}

// Close
function closeModals() {
  modal.style.display = 'none';
  profileModal.style.display = 'none';
  deleteModal.style.display = 'none';
  createFolderModal.style.display = 'none'
}
// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
  if ( e.target == profileModal){
    profileModal.style.display = 'none';
  }
  if (e.target == deleteModal){
    deleteModal.style.display = 'none';
  }
  if(e.target == createFolderModal){
    createFolderModal.style.display = 'none'
  }
}

//https://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery
function downloadFile(element){
  const method = "GET";
  const token = localStorage.getItem('serverToken');
  const id = element.id;
  let divId =  document.getElementById(id);
  let fileName = divId.childNodes[3].childNodes[1].innerHTML
  const url = 'http://'+window.location.host+'/download?serverToken='+token+'&idFile='+id;
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
function createFolder(){
  let currentUrl = window.location.href;
  let parent = currentUrl.split('=')[1];
  fileName = document.getElementById('fileName').value;
  const token = localStorage.getItem('serverToken');
  let url = `http://localhost/createFolder?token=${token}&name=${fileName}&parent=${parent}`;
  fetch(url)
  .then(response => window.location.reload())
}
function openFolder(id){
  console.log("opening folder")
  let url = window.location.href;
  url += '?parent='+id;
  window.location.replace(url);
}
function getFileInfo(){
  const token = localStorage.getItem('serverToken');
  let filesDiv = document.getElementById('main-content');
  let currentUrl = window.location.href;
  let parent = currentUrl.split('=')[1];
  console.log(parent)
  let url = `http://localhost/fileList?serverToken=${token}`;
  if (searchInput.value.length > 0)url+=`&search=${searchInput.value}`;
  if(parent)url+=`&parent=${parent}`;
  fetch(url)
  .then(response =>response.json())
  .then(json => {
    let htmlContent = '';
    for(let f in json.folder.files) {
      let fileContent;
      if (json.folder.files[f].extension == "folder"){
        fileContent =`
          <div class="flex-card col-2" onclick="openFolder('${json.folder.files[f].idFile}')" id = "${json.folder.files[f].idFile}" > 
            <div class="flex-card__media">
              <img src="../assets/images/icons/187640-file-types/png/${json.folder.files[f].extension}.png" alt = "img1" >
            </div>
            <div class="flex-card__content">
              <h3 id = "${json.folder.files[f].idFile}" class="flex-card__content-title">${json.folder.files[f].name}</h3>
            </div>
        </div>
        `
      } else
      fileContent =`
      <div class="flex-card col-2" id = "${json.folder.files[f].idFile}" > 
        <div class="flex-card__media">
          <img src="../assets/images/icons/187640-file-types/png/${json.folder.files[f].extension}.png" alt = "img1" >
        </div>
        <div class="flex-card__content">
          <h3 id = "${json.folder.files[f].idFile}" class="flex-card__content-title">${json.folder.files[f].name}.${json.folder.files[f].extension}</h3>
          <div class="flex-card__actions">
              <button id = "${json.folder.files[f].idFile}" onclick="openDeleteModal(this)" class="flex-card__button button-delete"><i class="fas fa-trash-alt"></i></button>
              <button id = "${json.folder.files[f].idFile}" onclick="downloadFile(this)" class="flex-card__button button-download"><i class="fas fa-cloud-download-alt"></i></button>
          </div>
        </div>
    </div>
    `
    htmlContent += fileContent;
    }
    filesDiv.innerHTML = htmlContent;
  })
}

//CLICK DELETE
function deleteFile(element){
  const url = 'http://'+window.location.host+'/delete';
  const method = "DELETE"
  let fileId = element.id;
  let svtoken = window.localStorage.getItem('serverToken');
  let data={
    idFile:fileId,
    serverToken:svtoken
  }
  postData(method,url,data,function(buff){
    if(buff.readyState===buff.DONE && buff.status ==200){
      let body = JSON.parse(buff.responseText )
        window.location.reload(body.location);
        
    }
  });
}
//function GOOLE
function googleAuth(){
  let url ='https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http%3A//localhost/authorize/google&client_id=282450647382-g7epadv9ud6slg873pm75gmhinhqjsao.apps.googleusercontent.com';
  
  url+='&state='+ localStorage.getItem('serverToken');
  window.location.replace(url);
}
//function ONEDRIVE
function oneDriveAuth(){
  let url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=03f8e27d-7b57-4b58-a096-3887fc515d43&response_type=code&redirect_uri=http://localhost/authorize/onedrive&response_mode=query&scope=openid offline_access Files.ReadWrite.All";
  url+='&state='+ localStorage.getItem('serverToken');
  window.location.replace(url);
}
//function DROPBOX
function dropboxAuth(){
  let url = 'https://www.dropbox.com/oauth2/authorize?client_id=zfxu0qci4k2cofb&response_type=code&redirect_uri=http://localhost/authorize/dropbox'
  url+='&state='+ localStorage.getItem('serverToken');
  window.location.replace(url);
}

function postData(method,url,data,success) {
  // an encoding required
  var httpRequest = new XMLHttpRequest();
  httpRequest.open(method,url,true);
  httpRequest.onreadystatechange= function(){success(httpRequest)};
  httpRequest.setRequestHeader('Content-Type', 'aplication/json');
  httpRequest.send(JSON.stringify(data));
}



function verifyToken(){
  const url = 'http://'+window.location.host+'/validateToken';
  let data = {serverToken:localStorage.getItem('serverToken')};
  postData('POST',url,data,(dataServer)=>{
      if(dataServer.readyState===dataServer.DONE && dataServer.status ==200)
      {
        let body = JSON.parse(dataServer.responseText);
      }
      else if(dataServer.status ==401){
        window.location.replace('http://'+window.location.host+'/login');
      }
  });
}

