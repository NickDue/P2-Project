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

app.get('/', (req, res) => {
    res.render('deltager')
})  
app.get('/account', (req,res) =>{
    res.render('chooseaccount')
})
app.get('/register', (req,res)=>{
    res.render('register');
});

app.get('/allaccounts', (req,res)=>{
    res.render('accounts',{ name: req.user.name });
});

app.get('/adminlogin',checkNotAuthenticated, (req,res)=>{
    res.render('adminlogin');
});
app.get('/samaritlogin',checkNotAuthenticated, (req,res)=>{
    res.render('samaritlogin');
});
app.get('/admin', checkAuthenticated, (req,res) =>{  
    res.render('admin', { name: req.user.name }) 
})
app.get('/direction/:id', checkAuthenticated, (req,res) =>{ 
    res.render('direction', { name: req.user.name, something: req.params.id});
})
app.get('/samarit', (req,res) =>{ // Mangler der ikke en checkauthenticate her?
    res.render('samarit', { name: req.user.name });
})
app.get('/javascript/deltager.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/deltager.js')
})
app.get('/javascript/administrator.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/administrator.js')
})
app.get('/javascript/accounts.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/accounts.js')
})
app.get('/picture/arrow.png', (req,res) =>{
    res.sendFile(__dirname + '/picture/arrow.png')
})
app.get('/javascript/samarit_java.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/samarit_java.js')
})
app.get('/javascript/movement.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/movement.js')
})
app.get('/javascript/direction.js', (req,res) =>{
    res.sendFile(__dirname + '/javascript/direction.js')
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

app.post('/adminlogin',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/adminlogin',
    failureFlash: true
}))

app.post('/samaritlogin',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/samarit',
    failureRedirect: '/samaritlogin',
    failureFlash: true
}))
/*
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/samaritlogin')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/admin')
    }
    next()
}  */
app.post('/register', async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            password: hashedPassword,
            permissions: req.body.rights
        })
        fs.writeFile(__dirname + '/database/accounts.json', JSON.stringify(users, null, 2), (error) => {
            if (error) throw error; 
        })
        res.redirect('/allaccounts');
    } catch {
        res.redirect('/register')
    }
})

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/account')
})

app.get('/updateTabel', (req, res) =>{
    res.writeHead(200, {"Content-type":"text/plain"});
    fs.createReadStream(__dirname + '/database/cases.json').pipe(res)
})

app.get('/accounts', (req, res) =>{
    res.writeHead(200, {"Content-type":"text/plain"});
    fs.createReadStream(__dirname + '/database/accounts.json').pipe(res)
})

app.post('/accept',(req,res)=> {
        req.on('data',function(chungus){
            let number = JSON.parse(chungus);
            res.redirect('/direction/'+number)
            objectCases[number].status = 'Optaget';
            console.log(objectCases[number].status);
            fs.writeFile(__dirname + '/database/cases.json', JSON.stringify(objectCases, null, 2), (error) => {
                if (error) throw error; 
            })
        })      
})

app.post('/adminStatus',(req,res)=> {
    req.on('data',function(chungus){
        let number = JSON.parse(chungus);
        if(number[1] == 24){
            objectCases[number[0]].status = 'Afsluttet';
        }
        else if(number[1] == 88){
            objectCases[number[0]].status = 'Optaget';
        }
        else if(number[1] == 55){
            objectCases[number[0]].status = 'Ledig';
        }
        fs.writeFile(__dirname + '/database/cases.json', JSON.stringify(objectCases, null, 2), (error) => {
            if (error) throw error; 
        })
    })      
})

app.post('/finish',(req,res)=> {
    req.on('data',function(c){
        let number = JSON.parse(c);
        console.log(number)
        res.redirect('/samarit')
        objectCases[number].status = 'Afsluttet';
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
                    

app.post("/moreinfo", (req,res) =>{
    res.writeHead(200, {"Content-type":"text/plain"}); // Serveren siger ok, og tak for data, til clienten
        req.on('data', function(chunk){
            let info = JSON.parse(chunk);
            for(e of objectCases) {
                if(parseInt(e.coordX) === info[0] && parseInt(e.coordY) === info[1])
                e.exInfo = info[2];
                fs.writeFile(__dirname + '/database/cases.json', JSON.stringify(objectCases, null, 2), (error) => {
                    if (error) throw error; 
                })
                break;
            }
            
            
        })
})

app.post('/goback',(req,res)=>{
    req.on('data',function(c){
        let number = JSON.parse(c);
        console.log(number)
        res.redirect('/samarit')
        objectCases[number].status = 'Ledig';
        console.log(objectCases[number].status);
        fs.writeFile(__dirname + '/database/cases.json', JSON.stringify(objectCases, null, 2), (error) => {
            if (error) throw error; 
        })
    }) 
})

app.post('/deleteAccount',(req,res)=>{
    req.on('data',function(del){
        let toBeDeleted = JSON.parse(del);
        users = users.filter(iden => iden.id != parseInt(toBeDeleted))
        fs.writeFile(__dirname + '/database/accounts.json', JSON.stringify(users, null, 2), (error) => {
            if (error) throw error; 
        })
        
    })
})

app.listen(port, ()=>{
    console.log(`Server is now live @${port}`);
});

let objectCases = [];   
let users = [];
loadAccounts();
loadCases();
x=0;

function personCase(info, x) { //Vores constructer funktion der laver cases
    let coord = info.toString().split(','); // laver info object om til en string og splitter derefter elementer fordelt med "," og gemmes i et array.
    this.number = x; //nummeret på casen
    this.coordX = coord[0]; //X koordinat
    this.coordY = coord[1]; //Y koordinat
    this.date   = currentDate();
    this.exInfo = 'Ingen info';
    this.status = 'Ledig';
    this.samarit = 'Ingen';
    console.log(this.coordX + "+" + this.coordY + "+" + this.number);
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/samaritlogin')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/admin')
    }
    next()
} 

function loadAccounts(){
    fs.readFile(__dirname + '/database/accounts.json', (err, val) =>{
        if (err) throw err;
        let object = JSON.parse(val);
        for (e of object){
            users.push(e)
        }
        //console.log("Accounts loaded");
    });
}
function loadCases(){
    fs.readFile(__dirname + '/database/cases.json', (err, val) =>{
        if (err) throw err;
        let object = JSON.parse(val);
        if(object.length === 1){
            objectCases.push(object[0])
        }
        else if(object.length > 2) { 
            for (e of object){
                objectCases.push(e);
                x++;
            }  
        }
        else {
            console.log("No existing cases");
        }
    });
}


function currentDate () {
    let right_now = new Date();
    let year = right_now.getFullYear();
    let month = right_now.getMonth()+1;
    let day = right_now.getDate();
    let hour = right_now.getHours();
    let minute = right_now.getMinutes()
    if (minute < 10) {
        minute = "0"+minute
    }
    return day + '/' + month + "-" + year + ", kl " + hour + ":" + minute;
}