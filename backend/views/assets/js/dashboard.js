

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
};

const populateTable = () => {
  const url = `http://localhost/userInfo`;
  fetch(url)
  .then(response => response.json())
  .then(json => {
    const table = document.getElementById('users-table');
    const deleteCell = '<td class="delete"><i class="fas fa-user-times"></i></td>'
    let tablebody = ''
    for(let i = 0; i <json.length; i++) {
      let row ='<tr>';
      let email = `<td>${json[i].email ? json[i].email : 'error'}</td>`;
      let admin = `<td>Yefornow</td>`;
      let google = `<td>${json[i].google == -1 ? 'Not connected' : json[i].google}</td>`;
      let dropbox = `<td>${json[i].dropbox == -1 ? 'Not connected' : json[i].dropbox}</td>`;
      let onedrive = `<td>${json[i].onedrive == -1 ? 'Not connected' : json[i].onedrive}</td>`;
      row = row + email + admin + google + dropbox + onedrive + deleteCell + '</tr>';
      tablebody += row;
    }
    table.innerHTML = tablebody;
  });
};

window.onload = populateTable();