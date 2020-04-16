const http = require('http');
const fs = require('fs');
const port = 3160;
const hostname = '127.0.0.1';
x = 1;
let objectCases = [];

function personCase(info, x) { //Vores constructer funktion der laver cases
    let coord = info.toString().split(','); // laver info object om til en string og splitter derefter elementer fordelt med "," og gemmes i et array.
    this.number = x; //nummeret på casen
    this.coordX = coord[0]; //X koordinat
    this.coordY = coord[1]; //Y koordinat
    console.log(this.coordX + "+" + this.coordY + "+" + this.number);
}


http.createServer(function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('GOT: ' + req.method + ' ' + req.url);
    let query = require('url').parse(req.url,true).query;
    console.log(query);
    
    
    switch(req.url){   
        case '/':   
        case '/html/start.html':    
            res.writeHead(200, {'Content-type':'text/html'});
            fs.readFile('html/start.html', function (err, html){
                if (err) throw err;
                res.end(html);
            })
            break;
        case '/login.html':  
        case '/html/login.html':    
            res.writeHead(200, {'Content-type':'text/html'});
            fs.readFile('html/login.html', function (err, html){
                if (err) throw err;
                res.end(html);
            })
            break;
        case '/css/login.css':
            let fileStream = fs.createReadStream(__dirname + '/css/login.css', 'UTF-8');
                res.writeHead(200, {'Content-type':'text/css'});
                fileStream.pipe(res);
            break;  
        case '/css/start.css':
            res.writeHead(200, {'Content-type':'text/css'});
            fs.createReadStream(__dirname + '/css/login.css', 'UTF-8').pipe(res);
            break;
        case "/html/deltager.html":
            res.writeHead(200, {'Content-type':'text/html'});
            fs.readFile('html/deltager.html', function (err, html){
                if (err) throw err;
                res.end(html);
            })
            break;
        case "/javascript/deltager.js":
            res.writeHead(200, {'Content-type':'text/javascript'});
            fs.createReadStream(__dirname + '/javascript/deltager.js', 'UTF-8').pipe(res);
            break;
        case "/javascript/login.js":
            res.writeHead(200, {'Content-type':'text/javascript'});
            fs.createReadStream(__dirname + '/javascript/login.js', 'UTF-8').pipe(res);
            break;
        case "/javascript/movement.js":
            res.writeHead(200, {'Content-type':'text/javascript'});
            fs.createReadStream(__dirname + '/javascript/movement.js', 'UTF-8').pipe(res);
            break;
        case '/css/style.css':
            res.writeHead(200, {'Content-type':'text/css'});
            fs.createReadStream(__dirname + '/css/style.css', 'UTF-8').pipe(res);
            break;
        case `/html/test.html/?usrn=${query.usrn}&psw=${query.psw}`:
                if(query.usrn === "samarit" && query.psw === "help"){
                    res.writeHead(200, {'Content-type':'text/html'});
                    fs.readFile('html/test.html', function (err, html){
                    if (err) throw err;
                    res.end(html);
                    })
                }
                else {
                    res.writeHead(404, {'Content-type':'text/html'});
                    fs.readFile('html/404.html', function (err, html){
                    if (err) throw err;
                    res.end(html);
                    })
                }
            
               
            
            break;
            
    }
    if (req.method === 'POST'){ //en if statement, der forventer POST methods
        switch (req.url){ // switch med forskellige cases 
            case "/coords":
                res.writeHead(200, {"Content-type":"text/plain"}); // Serveren siger ok, og tak for data, til clienten
                req.on('data', function(chunk){ // req.on = der sker noget, "data"(event) = hvad sker der, function(chunk) = hvad gør jeg så
                    let info = JSON.parse(chunk); // laver JSONstring om til noget vi kan læse og gemmer i info
                    
                    objectCases[x] = new personCase(info,x); //constructor funktion, som laver et objekt med den info som er modtaget fra deltager.js
                    let caseToSend = JSON.stringify(objectCases[x]);
                    
                    x++;
                
                })
        }
    }
}).listen(port, hostname, function () {
    console.log(`Now running on ${hostname}:${port}`);
});