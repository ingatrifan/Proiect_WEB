const dropboxV2Api = require('dropbox-v2-api');
const querystring = require('querystring');
const fs = require('fs');
const {google} = require('googleapis');
const mimeType = require('mime-types')
<<<<<<< HEAD

const GOOGLE_TOKEN ={"access_token":"ya29.a0Ae4lvC3AKc0e6oSpc7bl6QihgLT4RRiKkBQTSS4EQ7JNGGF_yNBDy5lxenYX0lcD57NNLC6pRW51MEUwrxteaEfp_8Or8oflqCoElvQ5NOQGUz0zXLlYcb8RCEyeo7LJQRepnZC1bxfCQus_kpATVcAUGIMS58fBasg","refresh_token":"1//0cBvWYzXMWa2PCgYIARAAGAwSNwF-L9Ir1S7TqviunKP7mWPbge5KXq_2WTWgIzJJQ1ypBFR4av30_2VXBIkfvREA5876U0cIjnw","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1587661742331};
const DROPBOX_TOKEN = "HJyKpgpHJ-AAAAAAAAAAMPpIdMZb21N4jqfNyGyaFCqt23QqxdN_p-SFPFp1whAD";
=======
const path = require("path")
const GOOGLE_TOKEN ={"access_token":"ya29.a0Ae4lvC3AKc0e6oSpc7bl6QihgLT4RRiKkBQTSS4EQ7JNGGF_yNBDy5lxenYX0lcD57NNLC6pRW51MEUwrxteaEfp_8Or8oflqCoElvQ5NOQGUz0zXLlYcb8RCEyeo7LJQRepnZC1bxfCQus_kpATVcAUGIMS58fBasg","refresh_token":"1//0cBvWYzXMWa2PCgYIARAAGAwSNwF-L9Ir1S7TqviunKP7mWPbge5KXq_2WTWgIzJJQ1ypBFR4av30_2VXBIkfvREA5876U0cIjnw","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1587661742331}
const DROPBOX_TOKEN = "HJyKpgpHJ-AAAAAAAAAAJ5hUOVxo_UUdyofbXO5ae0tdZA4M4sWkieijeEBocJP3"
>>>>>>> origin/master


//DROPBOX AUTH
const dropbox = dropboxV2Api.authenticate({
    token: DROPBOX_TOKEN
});
var oAuth2Client;
//GOOGLE DRIVE AUTH
<<<<<<< HEAD
fs.readFile('../controllers/credentials.json', (err, content) => {
=======
fs.readFile(path.resolve(__dirname,'./credentials.json'), (err, content) => {
>>>>>>> origin/master
  if (err) return console.log('Error loading client secret file:', err);
  const credentials =JSON.parse(content)
  const {client_secret, client_id, redirect_uris} = credentials.web;
  oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(GOOGLE_TOKEN)
});



exports.dropboxUpload =(file) =>{
    console.log("upload")
    dropbox({
        resource: 'files/upload',
        parameters: {
            path: `/dropbox/path/${file.name}`
        },
        readStream: fs.createReadStream(file.path)
    }, (err, result, response) => {
        if (err)console.log(err);
        console.log(result);
    });
}


exports.googleUpload= async(file)=> {
    const drive = google.drive({version: 'v3', auth: oAuth2Client});
    const fileMetadata = {
      'name': file.name
    };
    const media = {
      mimeType: mimeType.lookup(file.name),
      body: fs.createReadStream(file.path)
    };
    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, (err, file) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('File Id: ', JSON.stringify(file))
      }
    });
  }




// function authorize(credentials, callback) {
//     const {client_secret, client_id, redirect_uris} = credentials.web;
//     const oAuth2Client = new google.auth.OAuth2(
//         client_id, client_secret, redirect_uris[0]);
  
//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//         console.log();
//       if (err) return getAccessToken(oAuth2Client, callback);
//       oAuth2Client.setCredentials(JSON.parse(token));
//       callback(oAuth2Client);
//     });
// }

//GOOGLE AUTH
// const TOKEN_PATH = 'token.json';
// const SCOPES = ['https://www.googleapis.com/auth/drive']
  // function getAccessToken(oAuth2Client, callback) {
  //   const authUrl = oAuth2Client.generateAuthUrl({
  //     access_type: 'offline',
  //     scope: SCOPES,
  //   });
  //   console.log('Authorize this app by visiting this url:', authUrl);
  //   const rl = readline.createInterface({
  //     input: process.stdin,
  //     output: process.stdout,
  //   });
  //   rl.question('Enter the code from that page here: ', (code) => {
  //     rl.close();
  //     oAuth2Client.getToken(code, (err, token) => {
  //       if (err) return console.error('Error retrieving access token', err);
  //       oAuth2Client.setCredentials(token);
  //       // Store the token to disk for later program executions
  //       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
  //         if (err) return console.error(err);
  //         console.log('Token stored to', TOKEN_PATH);
  //       });
  //       callback(oAuth2Client);
  //     });
  //   });
  // }

//DROPBOX AUTH
//dbid:AAAWx3UmTBZorcWQkKaS1GIacUFYKpyANco
// const dropbox = dropboxV2Api.authenticate({
//     client_id: 'zfxu0qci4k2cofb',
//     client_secret: '2tzh6bcoyg7040w',
//     redirect_uri: 'http://localhost:3000/code/'
// });

// const authUrl = dropbox.generateAuthUrl();

// console.log(authUrl);
// parseUrl=(req)=>{
//     const parsed = url.parse(req.url);
//     const query  = querystring.parse(parsed.query);
//     return query
// }

// exports.dropboxCode = (req,res) =>{
//     console.log("got Here")
//     var query = parseUrl(req)
//     var code = query.code;
//     console.log(code);
//     dropbox.getToken(code, (err, result, response) => {
//         console.log(result);
//         var accessToken = result.access_token;
//     });
// }
