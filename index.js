//@sarthak_acoustic
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const httpServer = http.createServer((req, res)=>{
    unifiedServer(req, res);
});

  // //GET the headers as an Object
  // //console.log('the requested path is : '+trimmedpath + ' with method : '+method+' with query string object ',queryStringObject);
  // console.log('the requested headers are : ', headers);

httpServer.listen(config.httpPort, ()=>{
  console.log('the server is listening on port '+config.httpPort+' and in '+config.envName+' mode');
});

var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
//creating a httpsServer with httpsServerOptions(for encryption)
const httpsServer = https.createServer(httpsServerOptions, (req, res)=>{
  unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, ()=>{
  console.log('the server is listening on port '+config.httpsPort);
});

const unifiedServer = (req, res)=>{
  //##parsing the requested url path
  const pathURL = url.parse(req.url, true);
  const path = pathURL.pathname;
  //regex
  const trimmedpath = path.replace(/^\/+|\/+$/g, '');
  //##parsing query string object
  const queryStringObject = pathURL.query;

  //##parsing http request method
  const method = req.method.toUpperCase();
  //headers
  var headers = req.headers;
  //GET the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = ''
  req.on('data', (data)=>{
    buffer += decoder.write(data);
  });
  req.on('end', ()=>{
    buffer += decoder.end();


    var choosenHandler = typeof(router[trimmedpath]) !== 'undefined' ? router[trimmedpath] : handlers.notFound;
    //construct the data object that to send to the handler
    var data = {
      'trimmedpath' : trimmedpath,
      'queryStringObject': queryStringObject,
      'method': method,
      'payload': buffer,
      'headers': headers
    };

  choosenHandler(data, (statusCode, payload)=>{
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

    payload = typeof(payload) == 'object' ? payload : {};

    var payloadString = JSON.stringify(payload);
    //returing JSON headers
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(payloadString);
    console.log('returning the response : ', statusCode, payloadString);
     })
  })
};

var handlers = {};
//sample handler
// handlers.sample = (data, callback)=>{
//   callback(406, {"name" : "sample handler"});
// };
//ping handler [used to check whether our app is alive or not]
handlers.ping = (data, callback)=>{
  callback(200);
};
//notFound handler
handlers.notFound = (data, callback)=>{
  callback(404);
};
//define a request router
var router = {
  'ping' : handlers.ping
};
