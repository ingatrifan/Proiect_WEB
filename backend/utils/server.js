const http = require('http');
const httpStatusCode = require('http-status-codes');

class HTTPServer {

    constructor(router) {
        this.PORT = 3000;
        this.router = router;
    }

    listen() {
        let server;
        let app = this;
        try {
            server = http.createServer((req, res) => {
                app.router.route(req, res);
                res.end();
            });
        } catch (err) {
            res.statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
            res.end();
        }
        server.listen(this.PORT);
        console.log('Listening on port:', this.PORT);
    }
}

module.exports = {
    HTTPServer
};