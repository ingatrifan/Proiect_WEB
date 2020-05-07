const urlModule = require('url');

class Router {

    constructor() {
        this.endPoints = {};
    }

    constructIdentifier(method, url) {
        return `${method}.${url}`;
    }

    use(url, router) {
        for (let endPoint in router.endPoints) {
            if (endPoint.startsWith('GET')) {
                let newIdentifier = endPoint.slice(0, 4) + url + endPoint.slice(4);
                this.endPoints[newIdentifier] = router.endPoints[endPoint];
                //console.log('NEW:',newIdentifier,this.endPoints[newIdentifier]);
            } else {
                let newIdentifier = endPoint.slice(0, 5) + url + endPoint.slice(5);
                this.endPoints[newIdentifier] = router.endPoints[endPoint];
                //console.log('NEW:',newIdentifier,this.endPoints[newIdentifier]);
            }
        }
    }

    registerEndPoint(method, url, handler) {
        let identifier = this.constructIdentifier(method, url);

        if (this.endPoints[identifier]) {
            throw new Error('EndPoint already exists!');
        }

        if (typeof handler === undefined || !handler) {
            throw new Error('Cant register a null or undefined handler at an EndPoint!');
        }
        this.endPoints[identifier] = handler;
        console.log('Endpoint registered:', method, url);
    }

    getHandler(method, url) {
        let identifier = this.constructIdentifier(method, url);
        if (!this.endPoints[identifier]) {
            return new Error("Endpoint not registered!");
        }

        let handler = this.endPoints[identifier];

        if (!handler) {
            throw new Error("Handler null!");
        }

        return handler;
    }

    route(req, res) {
        try {
            let reqUrlString = req.url.split('?')[0];
            let pathName = urlModule.parse(reqUrlString, true, false).pathname;
            let method = req.method;
            console.log(method,pathName);
            let handler =   this.getHandler(method, pathName);
            console.log(handler);
            handler(req, res);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = {
    Router
};