function getHelp() {
    coordsX = Math.floor(randomDice())
    coordsY = Math.floor(randomDice())

    if (coordsX != null && coordsY != null) {
        document.getElementById("demo").innerHTML = 
        "Dine koordinater er:" + coordsX + "X," + coordsY + "Y.";
        document.getElementById("info").style.display = "block";
        document.getElementById("helpMe").style.display = "none";
        sendCoords(coordsX, coordsY);
    }
}

let coordsX;
let coordsY;

const coordsAPI = "http://127.0.0.1:3160/coords"; //vores gren på serveren vi gerne vil tilgå

async function sendCoords (x, y) { // Det er en async funktion fordi at den skal have alting klar før den sender til serveren 
    let data = JSON.stringify(x + "," + y); // laver en JSONstring af det vi vil sende og gemmer den i data
    await fetch(coordsAPI, { // fetch løser promisesen hvis stigen"coordsAPI" løkkes
        method: 'POST', // hvad for en metode
        body: data // body = hvad der reelt bliver sendt, data = vores JSONstring.
    })
    console.log("Info sent");
}
function randomDice(){  //Random nummer generator funktion - giver et tal mellem 1 og 100 (math.random floor tal)    
    number = Math.random()*101;
    //console.log(number);
    return number;
}

const infoAPI = "http://127.0.0.1:3160/moreinfo"

async function sendAdditionalInfo(information) {
    
    let array = [coordsX, coordsY, information.value];
    document.getElementById("theend").style.display = "block";
    document.getElementById("theend").style.backgroundColor = "white";
    await fetch(infoAPI, {
        method: "POST",
        body: JSON.stringify(array)
    })
    
}