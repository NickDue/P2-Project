const tabelAPI = "http://127.0.0.1:3160/updateTabel";
const acceptAPI = "http://127.0.0.1:3160/accept"; 

function rotate(destinationX,destinationY,originX,originY) {  //Formål at ændre pilens retning i samarit.html fra samarit til rapportør
    let arrow = document.getElementById("arrow");
    let angleForVector = calculateVector(destinationX,destinationY,originX,originY);
    arrow.style.transform = `rotate(${angleForVector.angle}deg)`    //Ændrer style attributen transform i samarit.html
    console.log(calculateVector(destinationX, destinationY, originX, originY));
}

// x1 = destinationX, y1 = destinationY, x2 = originX, y2 = originY

function calculateVector(destinationX,destinationY,originX,originY){  //Udregner vektor mellem to punkter, vinklen mellem de to vektorer og afstanden imellem punkterne (mellem rapportør og samarit)
    let vector = {
        distance : 0.0, 
        angle : 0.0
    };

    value = [0,0];
    value = calculateVectorBetweenPoints(destinationX,destinationY,originX,originY);

    vector.angle = calculateAngleVector(value);
    vector.distance = distanceBetweenPoints(destinationX,destinationY,originX,originY);
    console.log("Distance: " + vector.distance + " Angle: " + vector.angle);
    return vector;   
}

function calculateVectorBetweenPoints(destinationX,destinationY,originX,originY){ //Udregner vektoren mellem to punkter og gemmer det i et array med navnet vec
    vec = [0,0];
    vec[0] = originX - destinationX;
    vec[1] = originY - destinationY;
return vec
};

function calculateAngleVector(vec){ // Udregner vinklen mellem to vektorer - Vektoren givet i calculate vektor og en arbitrær vektor langs Y-aksen
    let x1 = 0;  // Arbitrær vektor langs y-aksen
    let y1 = 1;  // Arbitrær vektor langs y-aksen
    let x2 = vec[0];
    let y2 = vec[1];

    n = (x1 * x2 + y1 * y2) / (Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)));
    radians = Math.acos(n);

    angle = radiansToDegrees(radians); 

    if (vec[0] < 0) angle = angle * (-1); //HVAD GØR DENNE SÆTNING JONAS? SÅDAN AT GRADERNE ALTID KOMMER UD RIGTIG HVORDAN?
    return angle;
}

function radiansToDegrees(angle) {  //Udregner fra radianer til grader
    let pi = Math.PI;
    return angle * (180/pi);
}

function distanceBetweenPoints(destinationX, destinationY, originX, originY){ //Udregner afstanden mellem to punkter i et koordinat system
    let dist = Math.sqrt(Math.pow(originX-destinationX, 2) + Math.pow(originY-destinationY, 2));
    
    return dist;
}


async function getCases() {
    let table = document.getElementById("samarittable");
    table.innerHTML = '<tr><th>Case nr.</th><th>X-Koordinat</th><th>Y-Koordinat</th><th>Dato</th><th>Information</th><th>Status</th><th>Accepter</th></tr>'
    let element = await fetch(tabelAPI);
    let para = await element.json();
    for (let i = 0; i < para.length; i++) {
        updateTabel(para,i,table);
    }
}

function currentDate () {
    let right_now = new Date();
    let year = right_now.getFullYear();
    let month = right_now.getMonth()+1;
    let day = right_now.getDate();
    return day + '-' + month + "-" + year;
}

function updateTabel(para,i,table){ 
    if(para[i].status.toLowerCase() != "afsluttet"){
    let row = table.insertRow(); // adding new tr
        let cell1 = row.insertCell(); //adding new td
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        let cell4 = row.insertCell();
        let cell5 = row.insertCell();
        let cell6 = row.insertCell();
        let cell7 = row.insertCell();
        let username = para[i].number; // Tildeler et nummer til en bruger
        cell1.innerHTML = para[i].number + 1;
        cell2.innerHTML = para[i].coordX;
        cell3.innerHTML = para[i].coordY;
        cell4.innerHTML = currentDate();
        cell5.innerHTML = para[i].exInfo;
        cell6.innerHTML = para[i].status.toString();
        if(para[i].status.toLowerCase() == "ledig") {
            cell7.innerHTML = '<button action="admin" type="submit" id=\''+username+'\' onClick="acceptButt(\''+username+'\')" > Accept </button>' ; // Giver en accept knap \''+XXX+'\' lader os sende en variabel i et funktionskald i HTML                        
        }
    }
}

async function acceptButt(number) {
    let data = JSON.stringify(number); // laver en JSONstring af det vi vil sende og gemmer den i data
    await fetch(acceptAPI, { // fetch løser promisen hvis stigen "acceptAPI" lykkedes
        method: 'POST', // hvad for en metode
        body: data // body = hvad der reelt bliver sendt, data = vores JSONstring
    })
    window.location.assign("http://localhost:3160/direction/"+number); 
}

//-----------------------------------------Movement.js---------------------------------------------------
// Disse funktioner nedenunder bruges til at simulere bevægelse

function movement(destinationX,destinationY,originX,originY){  

    let dice = 0;
    let routeVector = calculateVectorBetweenPoints(destinationX,destinationY,originX,originY) //Udregner vector mellem rapportør og samarit
    let dist = distanceBetweenPoints(originX,originY,destinationX,destinationY);              //Udregner afstanden mellem rapportør og samarit
    let enhedsvektorX = (1/(dist))*routeVector[0]; 
    let enhedsvektorY = (1/(dist))*routeVector[1];
    let position = [originX,originY];
    let distance = 1000;   //Arbitrær stor værdi således at while loopet ikke stopper før distance er blevet tilskrevet værdi senere.
    while(distance > 5) {  //Når origin er nærmere end 5 enheder målet stopper loopet
        dice = randomDice(); //Random number generator der bruges til at udregne chance for at samaritten går forkert
        if (dice <= 98) {  //SAMARITTEN GÅR KORREKT
            distance = distanceBetweenPoints(position[0],position[1],destinationX,destinationY)
            position[0] += enhedsvektorX;
            position[1] += enhedsvektorY;
            console.log(distance);
            }
        else {     //SAMARITTEN GÅR FORKERT
            position[0] += enhedsvektorX*Math.random()*51;
            position[1] += enhedsvektorY*Math.random()*51;
            dist = distanceBetweenPoints(position[0],position[1],destinationX,destinationY);
            enhedsvektorX = (1/(dist))*(destinationX-position[0]);
            enhedsvektorY = (1/(dist))*(destinationY-position[1]);
           // console.log("check here"); UDKOMMENTER HVIS DER SKAL TJEKKES HVOR OFTE SAMARITTEN GÅR FORKERT I LOG
            }
    }
}

function randomDice(){  //Random nummer generator funktion - giver et tal mellem 1 og 100 (math.random floor tal)    
    number = Math.random()*101;
    //console.log(number);
    return number;
}
