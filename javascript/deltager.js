function getHelp() {
    let coordsX = prompt("Indtast dit X koordinat");
    let coordsY = prompt("Indtast dit Y koordinat");

    if (coordsX != NaN && coordsY != NaN) {
        document.getElementById("demo").innerHTML = 
        "Dine koordinater er:" + coordsX + "X," + coordsY + "Y. Hjælp er på vej!";
        document.getElementById("info").style.display = "block";
        sendCoords(coordsX, coordsY);
    }
}

const coordsAPI = "http://127.0.0.1:3160/coords"; //vores gren på serveren vi gerne vil tilgå

async function sendCoords (x, y) { // Det er en async funktion fordi at den skal have alting klar før den sender til serveren 
    let data = JSON.stringify(x + "," + y); // laver en JSONstring af det vi vil sende og gemmer den i data
    await fetch(coordsAPI, { // fetch løser promisesen hvis stigen"coordsAPI" løkkes
        method: 'POST', // hvad for en metode
        body: data // body = hvad der reelt bliver sendt, data = vores JSONstring.
    })
    console.log("Info sent");
}


//let data = JSON.stringify("X er " + x + " og Y er " + y);