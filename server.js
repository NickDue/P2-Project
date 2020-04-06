const http = require('http');
const fs = require('fs');
const port = 8888;
const hostname = '127.0.0.1';

http.createServer(function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('GOT: ' + req.method + ' ' + req.url);
    switch(req.url){
        case '/':
        case '/html/login.html':    
            res.writeHead(200, {'Content-type':'text/html'});
            fs.readFile('html/login.html', function (err, html){
                if (err) throw err;
                res.write(html);
                res.end();
            })
            break;
        case '/css/login.css':
            let fileStream = fs.createReadStream(__dirname + '/css/login.css', 'UTF-8');
                res.writeHead(200, {'Content-type':'text/css'});
                fileStream.pipe(res);
    }
}).listen(port, hostname, function () {
    console.log(`Now running on ${hostname}:${port}`);
});