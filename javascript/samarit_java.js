function rotate(destinationX,destinationY,originX,originY) {
    let arrow = document.getElementById("arrow");
    let angleForVector = calculateVector(destinationX,destinationY,originX,originY);
    arrow.style.transform = `rotate(${angleForVector.angle}deg)`
    console.log(calculateVector(destinationX, destinationY, originX, originY));
}

// x1 = destinationX, y1 = destinationY, x2 = originX, y2 = originY

function calculateVector(destinationX,destinationY,originX,originY){      //Udregner vektor mellem to punkter (mellem rapportør og samarit)
    let vector = {
        distance : 0.0, 
        angle : 0.0
    };

    vec = [0,0];
    vec[0] = originX - destinationX;
    vec[1] = originY - destinationY;

    vector.angle = calculateAngleVector(vec);
    vector.distance = distanceBetweenPoints(destinationX,destinationY,originX,originY);
    console.log("Distance: " + vector.distance, "Angle: " + vector.angle);
    return vector;
}

function calculateAngleVector(vec){ // Udregner vinklen mellem to vektorer - Vektoren givet i calculate vektor og en arbitrær vektor langs Y-aksen
    let x1 = 0;
    let y1 = 1;
    let x2 = vec[0];
    let y2 = vec[1];

    n = (x1 * x2 + y1 * y2) / (Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)));
    radians = Math.acos(n);

    angle = radiansToDegrees(radians); 

    if (vec[0] < 0) angle = angle * (-1);
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

const tabelAPI = "http://127.0.0.1:3160/updateTabel"; 
async function getCases() {
    let table = document.getElementById("samarittable");
    cleanTable();
    let element = await fetch(tabelAPI);
    let para = await element.json();
    for (let i = 0; i < para.length; i++) {
        updateTabel(para,i);
    }
}
function cleanTable(){
    let table = document.getElementById("samarittable");
        while (table.row != null) {
            table.deleteRow(0);
        }
    }
function updateTabel(para,i,table){
    let row = table.insertRow(); // adding new tr
        let cell1 = row.insertCell(); //adding new td
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        let cell4 = row.insertCell();
        let cell5 = row.insertCell();
        cell1.innerHTML = para[i].number;
        cell2.innerHTML = para[i].coordX;
        cell3.innerHTML = para[i].coordY;
        cell4.innerHTML = para[i].exInfo; //Lige nu giver den "Ingen info" i app.js. Skal rettes
        cell5.innerHTML = '<button type = "button" onClick = "acceptButt()" > Accept </button>'
                         + '<button type = "button" onClick = "rejectButt()" > Reject </button>';                          
}

function acceptButt () {
    console.log("You have accepted");
}
function rejectButt () {
    console.log("You have rejected");
} 