function calculateVector(delX,delY,samX,samY) {  //Udregner vektor mellem to punkter, vinklen mellem de to vektorer og afstanden imellem punkterne (mellem rapportør og samarit)
    let vector = {
        distance : 0.0, 
        angle : 0.0
    };

    value = [0,0];
    value = calculateVectorBetweenPoints(deltagerX,deltagerY,samaritX,samaritY);

    vector.angle = calculateAngleVector(value);
    vector.distance = distanceBetweenPoints(deltagerX,deltagerY,samaritX,samaritY);
   // console.log("Distance: " + vector.distance + " Angle: " + vector.angle);
    return vector;   
}

function calculateVectorBetweenPoints(deltagerX,deltagerY,samaritX,samaritY){ //Udregner vektoren mellem to punkter og gemmer det i et array med navnet vec
    vec = [0,0];
    vec[0] = samaritX - deltagerX;
    vec[1] = samaritY - deltagerY;
    return vec;
};

function calculateAngleVector(vec){ // Udregner vinklen mellem to vektorer - Vektoren givet i calculate vektor og en arbitrær vektor langs Y-aksen
    let x1 = 0;  // Arbitrær vektor langs y-aksen
    let y1 = 1;  // Arbitrær vektor langs y-aksen
    let pi = Math.PI;
    let x2 = vec[0];
    let y2 = vec[1];

    n = (x1 * x2 + y1 * y2) / (Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)));
    radians = Math.acos(n);
    angle = radians * (180/pi); // Udregner fra radianer til grader

    if (vec[0] > 0) angle = angle * (-1); // Hvis vektoren peger bagud (eller "til venstre"), skal der være en negativ vinkel på
    return angle;
}

function distanceBetweenPoints(deltX, deltY, samX, samY){ //Udregner afstanden mellem to punkter i et koordinat system
    let dist = Math.sqrt(Math.pow(samX-deltX, 2) + Math.pow(samY-deltY, 2));
    
    return dist;
}


function randomDice(){  //Random nummer generator funktion - giver et tal mellem 1 og 100 (math.random floor tal)    
    number = Math.random()*101;
    //console.log(number);
    return number;
}

const tabelAPI = "http://127.0.0.1:3160/updateTabel";

/* getdata() bliver ikke brugt, men gemt for versionscontrol */
async function getdata(number) {
    let element = await fetch(tabelAPI);
    let data = await element.json();
    var para = document.createElement("p");
    var node = document.createTextNode(data[number].coordX);
    para.appendChild(node);
    var ele = document.getElementById("div1");
    ele.appendChild(para);
}

// initialize config variables here
let canvas, ctx;
let deltagerX;
let deltagerY;
let samaritX;
let samaritY;
let globalCoords;
let caseNumber;
let t;

/* ===== startMovement() =====
   Bliver kørt i onLoad()
   Fetcher cases.json 
   Finder canvas fra .ejs og definerer det til at være 2d
   Definerer x- og y-koords fra det givne casenr fra cases.json
   ctx.beginPath() begynder en ny path
   ctx.fillStyle og fillRect laver punkter til hhv. samarit og deltager
   eventListener venter på at man trykker på en knap
   t kører drawPosition() 10 gange i sekundet 
*/
async function startMovement (number) {
    caseNumber = number;
    let apiDATA = await fetch(tabelAPI);
    globalCoords = await apiDATA.json();
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    deltagerX = globalCoords[caseNumber].coordX;
    deltagerY = 99-globalCoords[caseNumber].coordY;
    samaritX = Math.floor(randomDice());
    samaritY = Math.floor(randomDice());
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(deltagerX, deltagerY, 1, 1);
    ctx.fillStyle = "black";
    ctx.fillRect(samaritX, samaritY, 1, 1);

    document.addEventListener("keydown",keyPush);
    t = setInterval(drawPosition,1000);    //Opdaterer funktionen drawPosition 10 gange i sekundet
}

/* ===== drawPosition() =====
   Canvas elementet defineres fra HTML/ejs siden
   ctx opdaterer pathen for hver gennemkørsel af funktionen
   variablen "vector" modtager returobjektet fra calculateVector()
   pilen bliver roteret med værdien vector.angle
   afstanden bliver opdateret med værdien vector.distance
   hvis afstanden er 5 eller mindre, opdateres drawPosition funktionen ikke længere og man får beskeden "Du er ankommet til din patient"
*/
function drawPosition(){
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(samaritX, samaritY, 1, 1);
    let vector = calculateVector(deltagerX,deltagerY,samaritX,samaritY);
    let arrow = document.getElementById("arrow");
    arrow.style.transform = `rotate(${vector.angle}deg)`    //Ændrer style attributen transform i direction.ejs
    console.log(calculateVector(deltagerX, deltagerY, samaritX, samaritY));
    let dist = vector.distance;
    let distanceHTML = document.getElementById("distanceHTML");
    distanceHTML.innerHTML = Math.floor(dist);
    
    if(dist <= 5) {
        clearInterval(t);  // Når at samaritten er 5 meter eller mindre fra rapportøren, opdateres drawPosition funktionen ikke længere og man får beskeden "Du er ankommet til din patient".
        alert("Du er ankommet til din patient");
    }
}

function keyPush(evt) {      // Værdierne fra samaritX og samaritY ændres ved piletasterne. Tryk til venstre gør samaritX mindre, hvor at værdien forøges ved tryk til højre. Samme princip med samaritY for op og ned.
    switch(evt.keyCode) {
        case 37: //venstre
            samaritX-=1;
            break;
        case 38: //op
            samaritY-=1
            break;
        case 39: //højre
            samaritX+=1
            break;
        case 40: //ned
            samaritY+=1
            break;
    }
}

const afslutAPI = "http://127.0.0.1:3160/finish"
/* ===== afslutSag() =====
   Konverterer caseNumber til JSON streng
   fetcher afslutAPI
   Poster til app.js at det givne caseNumber er afsluttet
   Relocater til samarit.ejs */
async function afslutSag() {
    let caseToFinish = JSON.stringify(caseNumber);
    await fetch(afslutAPI, {
        method: 'POST',
        body: caseToFinish
    })
    window.location.assign("http://localhost:3160/samarit"); 
}


const cantCompleteAPI = "http://127.0.0.1:3160/goback"
/* ===== cantComplete()=====
   Konverterer caseNumber til JSON streng
   fetcher cantCompleteAPI
   Poster til app.js at det givne caseNumber ikke er afsluttet
   Relocater til samarit.ejs */
async function cantComplete() {
    let caseToFinish = JSON.stringify(caseNumber);
    await fetch(cantCompleteAPI, {
        method: 'POST',
        body: caseToFinish
    })
    window.location.assign("http://localhost:3160/samarit"); 
}
