const express = require('express');
const fs = require('fs');
const port = 3160;
const hostname = '127.0.0.1';
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    username => {
        return accounts.find(user => user.name === username); 
});
const accounts = []
let app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({ extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(flash())
app.use(session({
    secret: "b2-21",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/' || '/start', (req, res) => {
    res.render('start')
})  
app.get('/deltager', (req,res) =>{
    res.render('deltager')
})
app.get('/login', (req,res) =>{
    res.render('login');
})
app.get('/register', (req,res) =>{
    res.render('register');
})
app.get('/admin', (req,res) =>{
    res.render('admin');
})
app.get('/samarit', (req,res) =>{
    res.sendFile(__dirname + '/html/samarit.html');
})
app.get('/javascript/deltager.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/deltager.js')
})
app.get('/javascript/samarit_java.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/samarit_java.js')
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

app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.pass, 10);
        accounts.push({
            name: req.body.user,
            password: hashedPassword,
            id: Date.now().toString()
        })
        console.log(accounts);
        /*fs.readFile(__dirname + '/database/accounts.json', (err, val) => {
            if (err) throw err;
            let users = JSON.parse(val);
            users.push({
                name: req.body.user,
                password: hashedPassword,
                id: Date.now().toString()
            })
            fs.writeFile(__dirname + '/database/accounts.json', JSON.stringify(users, null, 2), (error) => {
                if (error) throw error;
            })
        })*/
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
})

app.get('/updateTabel', (req, res) =>{
    res.writeHead(200, {"Content-type":"text/plain"});
    fs.createReadStream(__dirname + '/database/cases.json').pipe(res)
})

app.post('/coords', (req, res) => {
    res.writeHead(200, {"Content-type":"text/plain"}); // Serveren siger ok, og tak for data, til clienten
                req.on('data', function(chunk){ // req.on = der sker noget, "data"(event) = hvad sker der, function(chunk) = hvad gør jeg så
                    let info = JSON.parse(chunk); // laver JSONstring om til noget vi kan læse og gemmer i info
                    objectCases[x] = new personCase(info,x); //constructor funktion, som laver et objekt med den info som er modtaget fra deltager.js
                    let caseToSend = JSON.stringify(objectCases);
                    fs.writeFile(__dirname + '/database/cases.json', JSON.stringify(objectCases, null, 2), (error) => {
                        if (error) throw error; 
                    })
                    x++;
                })
})


app.listen(port, ()=>{
    console.log(`Server is now live @${port}`);
});

let objectCases = [];
let users = [];
let x = 1;

function personCase(info, x) { //Vores constructer funktion der laver cases
    let coord = info.toString().split(','); // laver info object om til en string og splitter derefter elementer fordelt med "," og gemmes i et array.
    this.number = x; //nummeret på casen
    this.coordX = coord[0]; //X koordinat
    this.coordY = coord[1]; //Y koordinat
    console.log(this.coordX + "+" + this.coordY + "+" + this.number);
}

function getAccounts() {
    fs.readFile(__dirname + '/database/accounts.json', (err, val) =>{
        if(err) throw err;
        return JSON.parse(val);
    })
}


