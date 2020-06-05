

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

const populateTable = async () => {
  let token = localStorage.getItem('serverToken')
  const url = `http://localhost/userInfo?serverToken=${token}`;
  fetch(url)
  .then(response => response.json())
  .then(json => {
    if(!json.error) {
      const table = document.getElementById('users-table');
      const deleteCell = '<td class="delete"><i class="fas fa-user-times"></i></td>'
        let tablebody = ''
      for(let i = 0; i <json.length; i++) {
        let row ='<tr>';
        let email = `<td>${json[i].email ? json[i].email : 'error'}</td>`;
        let admin = `<td>${json[i].admin ? 'Admin' : 'Regular user'}</td>`;
        let google = `<td>${json[i].google == -1 ? 'Not connected' : json[i].google}</td>`;
        let dropbox = `<td>${json[i].dropbox == -1 ? 'Not connected' : json[i].dropbox}</td>`;
        let onedrive = `<td>${json[i].onedrive == -1 ? 'Not connected' : json[i].onedrive}</td>`;
        row = row + email + admin + google + dropbox + onedrive + deleteCell + '</tr>';
        tablebody += row;
      }
      table.innerHTML = tablebody;

      //adding on click to rows
      const rows = table.getElementsByTagName("tr");
      for(let i = 0; i < rows.length; i++) {
        rows[i].onclick = ()=> {
          if(rows[i].classList.contains('selected')) {
            rows[i].classList.remove('selected');
          }
          else {
            rows[i].classList.add('selected');
          }
        }
      }
    }
  });
};
window.onload = async()=> {
  await populateTable();
} 
