const http = require('http');
const fs = require('fs');
const port = 8888;
const hostname = '127.0.0.1';

http.createServer(function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('GOT: ' + req.method + ' ' + req.url);
    switch(req.url){
        case '/':
            res.write('Hello World');
            res.end();
    }
}).listen(port, hostname, function () {
    console.log(`Now running on ${hostname}:${port}`);
});