window.onload = populateOrRedirect(); 

function populateOrRedirect() {
  verifiyAdmin().then(response => {
    if(response) {
      populateTable().then(()=>{
        console.log('populated')
      });
    }
    else {
      window.location.replace("/"); 
    }
  });
}

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
      const deleteCell = '<td class="delete" onclick="return clickDelete(this)"><i class="fas fa-user-times"></i></td>';
      const cantDeleteCell ="<td>Can't delete admin!</td>";
        let tablebody = ''
      for(let i = 0; i <json.length; i++) {
        let row ='<tr>';
        let email = `<td>${json[i].email ? json[i].email : 'error'}</td>`;
        let admin = `<td>${json[i].admin ? 'Admin' : 'Regular user'}</td>`;
        let google = `<td>${json[i].google == -1 ? 'Not connected' : json[i].google}</td>`;
        let dropbox = `<td>${json[i].dropbox == -1 ? 'Not connected' : json[i].dropbox}</td>`;
        let onedrive = `<td>${json[i].onedrive == -1 ? 'Not connected' : json[i].onedrive}</td>`;
        let files = `<td>${json[i].numberOfFiles}</td>`;
        if(!json[i].admin) {
          row = row + email + admin + google + dropbox + onedrive + files + deleteCell + '</tr>';
        }
        else {
          row = row + email + admin + google + dropbox + onedrive + files + cantDeleteCell + '</tr>';
        }
        tablebody += row;
      }
      table.innerHTML = tablebody;

      //adding on click to rows
      const rows = table.getElementsByTagName('tr');
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

const getCSVTable = ()=> {
  const table = document.getElementById('users-table');
  const rows = table.getElementsByTagName('tr');
  const lines = [];
  lines.push('E-mail,Admin,Google,Dropbox,OneDrive,Number of files');

  for(let i = 0; i < rows.length; i++) {
    if(rows[i].classList.contains('selected')) {
      let currentLine = '';
      let cells = rows[i].getElementsByTagName('td')

      for(let j = 0; j < rows[i].cells.length - 1; j++) {
        let value = cells[j].textContent || cells[j].innerText;
        currentLine += value;
        currentLine += (j < (rows[i].cells.length - 2)) ? "," : "";
      }
      lines.push(currentLine);
    }
  }

  let csvString = lines.join('\n');
  console.log(csvString);
  const csvBlob = new Blob([csvString],{ type: 'text/csv' });
  const blobUrl = URL.createObjectURL(csvBlob);
  const anchorElement = document.createElement('a');

  anchorElement.href = blobUrl;
  let today = new Date();
  anchorElement.download = `users-table-${today}.csv`;
  anchorElement.click();
  URL.revokeObjectURL(blobUrl);
};

async function verifiyAdmin() {
  return new Promise((resolve) => {
    let token = localStorage.getItem('serverToken');
    if(!token) {
      resolve(false);

    } else {
      const url = `http://localhost/verifyAdmin?serverToken=${token}`;
      fetch(url)
      .then(response => response.json())
      .then(json => {
        if(json.error) {
          resolve(false);
        }
        else {
          if(json.admin != true) {
            resolve(false);
          }
        }
        resolve(true);
      })
    }
  });
}

function clickDelete(element) {
  let emailField = element.parentNode.firstChild;
  let row = element.parentNode;
  let emailText = emailField.textContent || emailField.innerText;
  deleteUser(emailText).then(()=> {
    row.parentNode.removeChild(row);
    return false;
  })
}

async function deleteUser(email) {
  let token = localStorage.getItem('serverToken');
  const url = `http://localhost/deleteUser?serverToken=${token}&email=${email}`;
  fetch(url,{
    method: 'delete'
  }).then(json => {
    if(json.status == 204) {
      console.log('deleted...');
      return true;
    }
    else {
      console.log('error...');
      return false;
    }
  })
}

