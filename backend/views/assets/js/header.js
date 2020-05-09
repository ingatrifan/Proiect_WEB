function updateHeader(isLoggedIn) {
    let buttonsDiv = document.getElementsByClassName('header-right')[0];
    if(!isLoggedIn) {
        buttonsDiv.innerHTML=`<a href="./about.html" class="about-us">About us</a>
        <a href="./register.html" class="account-button">Register</a>
        <a href="./login.html" class="account-button">Log in</a>`;
    }else {
        buttonsDiv.innerHTML=`<a href="./about.html" class="about-us">About us</a>
        <a href="./landingPage.html" class="account-button">Register</a>`;
    }
}
//true will have to be replaced by a function call to server with token
updateHeader(true);
