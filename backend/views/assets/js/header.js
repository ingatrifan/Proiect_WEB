const toggleHeader = (isOpen) => {
  //getting the necessary elements from the document
  const headerRight = document.getElementsByClassName('header-right')[0];
  const collapseButton = document.getElementById('collapse-header');
  const expandButton = document.getElementById('expand-header');
  if(!isOpen) {
    headerRight.style.display = 'block';
    collapseButton.style.display = 'block';
    expandButton.style.display = 'none';
  } else {
    headerRight.style.display = 'none';
    collapseButton.style.display = 'none';
    expandButton.style.display = 'block';
  }
}

const constructHeader = () => {
  let token = localStorage.getItem('serverToken');
  const headerRight = document.getElementsByClassName('header-right')[0];
  if(!token) {
    let html = `
    <a href="/about" class="about-us">About us</a>
    <a href="/register" class="account-button">Register</a>
    <a href="/login" class="account-button">Log in</a>
    `;
    headerRight.innerHTML = html;
  } else {
    let html = `
    <a href="/about" class="about-us">About us</a>
    <a href="/" class="account-button" onclick=logout()>Log out</a>
    `;
    headerRight.innerHTML = html;
  }
}

window.onload = constructHeader;

const logout = () => {
  localStorage.removeItem('serverToken');
}