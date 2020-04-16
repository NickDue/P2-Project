const express = require('express');
const fs = require('fs');
const port = 3160;
const hostname = '127.0.0.1';

let app = express();


app.set('view engine','ejs');

app.get('/' || '/html/start.html', (req, res) => {
    res.render('start')
})
app.get('/html/deltager.html', (req,res) =>{
    res.render('deltager')
})
app.get('/login.html', (req,res) =>{
    res.render('login');
})
app.get('/javascript/deltager.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/deltager.js')
})
app.get('/javascript/movement.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/movement.js')
})
app.get('/javascript/login.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/login.js')
})
app.get('/css/style.css', (req,res) =>{
    res.sendFile(__dirname + '/css/style.css')
})
app.get('/css/login.css', (req,res) =>{
    res.sendFile(__dirname + '/css/login.css')
})
app.get('/css/start.css', (req, res) => {
    res.sendFile(__dirname + '/css/start.css');
})
app.post('/coords', (req, res) => {
    res.writeHead(200, {"Content-type":"text/plain"}); // Serveren siger ok, og tak for data, til clienten
                req.on('data', function(chunk){ // req.on = der sker noget, "data"(event) = hvad sker der, function(chunk) = hvad gør jeg så
                    let info = JSON.parse(chunk); // laver JSONstring om til noget vi kan læse og gemmer i info
                    objectCases[x] = new personCase(info,x); //constructor funktion, som laver et objekt med den info som er modtaget fra deltager.js
                    let caseToSend = JSON.stringify(objectCases[x]);
                    x++;
                })
})
app.listen(port, ()=>{
    console.log(`Server is now live @${port}`);
});

let objectCases;