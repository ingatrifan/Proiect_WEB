const toggleHeader = (isOpen) => {
  //getting the necessary elements from the document
  let headerRight = document.getElementsByClassName('header-right')[0];
  let collapseButton = document.getElementById('collapse-header');
  let expandButton = document.getElementById('expand-header');
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