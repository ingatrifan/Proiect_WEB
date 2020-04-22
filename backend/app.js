//for demonstrative purposes
const http = require('http');
const url = require('url');
const httpStatusCode = require('http-status-codes');
const fs = require('fs');
const {Router} = require('./routes/router');
const {HTTPServer} = require('./utils/server');


const app = new HTTPServer(router);
app.listen();


