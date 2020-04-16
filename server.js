const http = require('http');
const fs = require('fs');
const port = 3160;
const hostname = '127.0.0.1';
x = 1;
let objectCases = [];

function personCase(info, x) { //Vores constructer funktion der lave cases
    let coord = info.toString().split(','); // laver info object om til en string og splitter der efter elementer fordelt med "," og gemmer i et array.
    this.number = x; //nummeret på casen
    this.coordX = coord[0]; //X kordinant
    this.coordY = coord[1]; //Y kordinant
    console.log(this.coordX + "+" + this.coordY + "+" + this.number);
}


http.createServer(function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('GOT: ' + req.method + ' ' + req.url);
    switch(req.url){      
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
        case '/':
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
        case "/javascript/movement.js":
            res.writeHead(200, {'Content-type':'text/javascript'});
            fs.createReadStream(__dirname + '/javascript/movement.js', 'UTF-8').pipe(res);
            break;
        case '/css/style.css':
            res.writeHead(200, {'Content-type':'text/css'});
            fs.createReadStream(__dirname + '/css/style.css', 'UTF-8').pipe(res);
            break;
    }
    if (req.method === 'POST'){ //en if statement der forventer POST methods
        switch (req.url){ // switch med forskellige cases 
            case "/koords":
                res.writeHead(200, {"Content-type":"text/plain"}); // Serveren siger ok, og tak for data, til clienten
                req.on('data', function(chunk){ // req.on = der sker noget, "data"(event) = hvad sker der, function(chunk) = hvad gør jeg så
                    let info = JSON.parse(chunk); // laver JSONstring om til noget vi kan læse og gemmer i info
                    
                    objectCases[x] = new personCase(info,x); //construktor funktion som laver et objekt med den info som er modtaget fra deltager.js
                    x++;
                })
        }
    }
}).listen(port, hostname, function () {
    console.log(`Now running on ${hostname}:${port}`);
});