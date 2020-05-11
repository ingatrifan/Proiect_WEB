// Get DOM Elements
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector("#modal-btn");
const closeBtn = document.querySelector('.close');
const burger = document.getElementById("burger");
const arrowBack = document.querySelector(".back-arrow");
const bar = document.querySelector(".bar");
const sidepart = document.querySelector(".sidepart");
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
  const url = 'upload';
  fetch(url,
    {
      method:'POST',
      body:formData
    }).then(response=>{
      //refresh page
        location = location;
    });

} 
form.addEventListener('submit', handleForm);
//action="upload" method="POST" enctype="multipart/form-data"
