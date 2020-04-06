// Get DOM Elements
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector("#modal-btn");
const closeBtn = document.querySelector('.close');
const burger = document.getElementById("burger");
const arrowBack = document.querySelector(".back-arrow");
const bar = document.querySelector(".bar");
const sidepart = document.querySelector(".sidepart");
console.log(modalBtn);
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
