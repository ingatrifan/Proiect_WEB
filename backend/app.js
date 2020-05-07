//for demonstrative purposes
const http = require('http');
const {HTTPServer} = require('./utils/server');
const { router } = require("./routes")


const app = new HTTPServer(router);

app.listen()


