const searchTable = () => {
  const searchInput = document.getElementById('search-input');
  const filter = searchInput.value.toUpperCase();
  const table = document.getElementById('users-table');
  const trows = table.getElementsByTagName('tr');

  for(i = 0; i < trows.length; i++) {
    let td = trows[i].getElementsByTagName('td')[0];
    if(td) {
      let textValue =td.textContent || td.innerText;
      if(textValue.toUpperCase().indexOf(filter) > -1) {
        trows[i].style.display = '';
      }
      else {
        trows[i].style.display='none';
      }
    }
  }
}