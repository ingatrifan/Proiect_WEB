const urlModule = require('url');

class Router {

    constructor() {
        this.endPoints = {};
    }

    constructIdentifier(method, url) {
        return `${method}.${url}`;
    }

    optionHandler(req,res) {

      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      };
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      

      res.writeHead(204,headers);
      res.end();
    }

    use(url, router) {
        for (let endPoint in router.endPoints) {
            if (endPoint.startsWith('GET')) {
                let newIdentifier = endPoint.slice(0, 4) + url + endPoint.slice(4);
                this.endPoints[newIdentifier] = router.endPoints[endPoint];
                //console.log('NEW:',newIdentifier,this.endPoints[newIdentifier]);
            } else if(endPoint.startsWith('POST')) {
                let newIdentifier = endPoint.slice(0, 5) + url + endPoint.slice(5);
                this.endPoints[newIdentifier] = router.endPoints[endPoint];
                //console.log('NEW:',newIdentifier,this.endPoints[newIdentifier]);
            } else {
                let newIdentifier = endPoint.slice(0, 8) + url + endPoint.slice(8);
                this.endPoints[newIdentifier] = router.endPoints[endPoint];
                console.log('NEW:',newIdentifier,this.endPoints[newIdentifier]);
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

        if(method !== 'OPTIONS') {
            this.registerEndPoint("OPTIONS",url, (req,res) => {
                this.optionHandler(req,res);
            });
        }
        
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
            let handler =   this.getHandler(method, pathName);
            handler(req, res);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = {
    Router
};