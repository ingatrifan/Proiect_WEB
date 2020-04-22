//for demonstrative purposes
const http = require('http');
const url = require('url');
const httpStatusCode = require('http-status-codes');
const fs = require('fs');
const {Router} = require('./routes/router');
const {HTTPServer} = require('./utils/server');


const router = new Router();
process.on("uncaughtException", (err) => {
    console.log("Caught error", err);
});

router.registerEndPoint('GET', '/ex', function (req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({success: true, message: 'example ran successfully'}))
});

const app = new HTTPServer(router);
app.listen();


