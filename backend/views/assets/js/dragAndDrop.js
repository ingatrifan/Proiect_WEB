let dropArea = document.getElementById('drop-area');
let filesDone = 0
let filesToDo = 0
let progressBar = document.getElementById('progress-bar')
let errorMsg = document.getElementById('error-msg')

function initializeProgress(numfiles) {
    progressBar.style = "display:block"
    progressBar.value = 0
    filesDone = 0
    filesToDo = numfiles
  }
  
  function progressDone() {
    filesDone++
    progressBar.value = filesDone / filesToDo * 100
    if (filesDone == filesToDo)    
      location.reload();
  }
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
  
  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
  
  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })
  
  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })
  
  function highlight(e) {
    dropArea.classList.add('highlight')
  }
  
  function unhighlight(e) {
    dropArea.classList.remove('highlight')
  }
  dropArea.addEventListener('drop', handleDrop, false)

  function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files
  
    handleFiles(files)
  }
  async function handleFiles(files) {
    files = [...files]
    initializeProgress(files.length) 
    await files.forEach(uploadFile)

  }
  function uploadFile(file) { 
    // event.preventDefault(); 
    const formData = new FormData();
    let currentUrl = window.location.href;
    let parent = currentUrl.split('=')[1];
    formData.append('file',file);
    formData.append('serverToken',localStorage.getItem('serverToken'));
    let url = 'http://'+window.location.host+'/upload';
    if(parent)url+=`?parent=${parent}`;
    fetch(url,
      {
        method:'POST',
        body:formData
      }).then(response=>
        //refresh 
        response.json()
        
         // location.reload(true);
        
      ).then((data)=>{
        if(data.success==true){
          progressDone();
        //   window.location=data.location;
        } else{
          // console.log(errorMsg)
          errorMsg.innerHTML = data.message;
          errorMsg.style = "display:block"
        }
      });
  } 

