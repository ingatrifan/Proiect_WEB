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