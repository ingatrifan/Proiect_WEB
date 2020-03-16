
let endpoints = {};

function constructIdentifier(method,url) {
    return `${method}.${url}`;
}

//to fix cors errors
function optionHandler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Origin');
    res.setHeader('Access-Control-Allow-Credentials', true);
}

// use this to register an endpoint
function registerEndPoint(method,url,handler) {
    let identifier = constructIdentifier(method,url);

    if(endpoints[identifier]) {
        throw new Error('EndPoint already exists!');
    }

    if(typeof handler === undefined || !handler) {
        throw new Error('Cant register a null or undefined handler at an EndPoint!');
    }

    endpoints[identifier] = handler;

    if(method !== "OPTIONS") {
        registerEndPoint("OPTIONS",url,(req,res)=>{
            optionHandler(req,res);
            res.end();
        });
    }

    console.log('Endpoint registered:',method,url);
}

//returns the handler specific to an endpoint and a method
function getHandler(method,url) {
    let identifier = constructIdentifier(method,url);
    if(!endpoints[identifier]) {
        return new Error("Endpoint not registered!");
    }
    let handler = endpoints[identifier];
    
    if(!handler) {
        throw new Error("Handler null!");
    }

    return handler;
}

module.exports = {
    endpoints,
    optionHandler,
    registerEndPoint,
    getHandler
}

