if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const fs = require('fs');
const port = 3160;
const hostname = '127.0.0.1';
const bcrypt = require('bcrypt');
const passport = require('passport')
const initializePassport = require('./passport-config');
const flash = require('express-flash')
const session = require('express-session')
const methodOveride = require('method-override')

initializePassport(
    passport, 
    name => users.find(user => user.name === name),
    id =>  users.find(user => user.id === id),
);
let app = express();
app.set('view engine','ejs');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(express.urlencoded({ extended: false}));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOveride('_method'))

app.get('/' || '/start', (req, res) => {
    res.render('start')
})  
app.get('/deltager', (req,res) =>{
    res.render('deltager')
})
app.get('/register',checkNotAuthenticated, (req,res)=>{
    res.render('register');
});
app.get('/login',checkNotAuthenticated, (req,res)=>{
    res.render('login');
});
app.get('/admin', checkAuthenticated, (req,res) =>{
    res.render('admin', { name: req.user.name });
})
app.get('/samarit', (req,res) =>{
    res.render('samarit');
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

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register',checkNotAuthenticated, async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            password: hashedPassword
        })
        res.redirect('/login');
    } catch {
        res.redirect('/register')
    }
    console.log(users);
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.get('/updateTabel', (req, res) =>{
    res.writeHead(200, {"Content-type":"text/plain"});
    fs.createReadStream(__dirname + '/database/cases.json').pipe(res)
})

app.post('/accept',(req,res)=> {
    res.writeHead(200,{"Content-type":"text/plain"})
        req.on('data',function(chungus){
            let number = JSON.parse(chungus);
            objectCases[number].status = 'Samarit er på sagen';
            console.log(objectCases[number].status);
            fs.writeFile(__dirname + '/database/cases.json', JSON.stringify(objectCases, null, 2), (error) => {
                if (error) throw error; 
            })
        })
        
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
let x = 0;

function personCase(info, x) { //Vores constructer funktion der laver cases
    let coord = info.toString().split(','); // laver info object om til en string og splitter derefter elementer fordelt med "," og gemmes i et array.
    this.number = x; //nummeret på casen
    this.coordX = coord[0]; //X koordinat
    this.coordY = coord[1]; //Y koordinat
    this.exInfo = 'Ingen info';
    this.status = 'Venter på accept';
    console.log(this.coordX + "+" + this.coordY + "+" + this.number);
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/admin')
    }
    next()
}
  


