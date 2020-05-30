// const toggleHeader = (isOpen) => {
//   //getting the necessary elements from the document
//   const headerRight = document.getElementsByClassName('header-right')[0];
//   const collapseButton = document.getElementById('collapse-header');
//   const expandButton = document.getElementById('expand-header');
//   if(!isOpen) {
//     headerRight.style.display = 'block';
//     collapseButton.style.display = 'block';
//     expandButton.style.display = 'none';
//   } else {
//     headerRight.style.display = 'none';
//     collapseButton.style.display = 'none';
//     expandButton.style.display = 'block';
//   }
// }
const togleLogo = () =>{
  console.log("here");
  if (window.screen.width <440){
    document.getElementById('logo').innerHTML = "STOL"
  } else document.getElementById('logo').innerHTML = "STOL - MODERN CLOUD STORAGE";
}
window.onresize = togleLogo;

const constructHeader = () => {
 
  let token = localStorage.getItem('serverToken');
  const navbar = document.getElementById('navbar');
  if(!token) {
    console.log(token)
    console.log(!token);
    let html = `
      <li class="logo"><a id="logo" href="/">STOL - Modern Cloud Storage</a></li>
      <li><a href="/about">About us</a></li>
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Register</a></li>
    `;
    navbar.innerHTML = html;
  } else {
    let html = `
      <li class="logo"><a id="logo" href="/">STOL - Modern Cloud Storage</a></li>
      <li><a href="/about">About us</a></li>
      <li><a href="/mainPage">My files</a></li>
      <li onclick=logout()><a href="/">Log out</a></li>
    `;
    navbar.innerHTML = html;
  }
}
window.onload = constructHeader();

const logout = () => {
  localStorage.removeItem('serverToken');
}