function myFunction() {
    let koordX = prompt("Indtast din X kordinat");
    let koordY = prompt("Indtast din Y kordinat");
    if (koordX != null && koordY != null) {
        document.getElementById("demo").innerHTML = 
        "Dine koordinater er:" + koordX + "X," + koordY +  "Y. Hjælp er på vej!";
        document.getElementById("info").style.display = "block";
        sendKoords(koordX, koordY);
    }
}

const koordAPI = "http://127.0.0.1:8888/koords"; //vores gren på serveren vi gerne vil tilgå

async function sendKoords (x, y) { // Det er en async funktion fordi at den skal have alting klar før den sender til serveren 
    let data = JSON.stringify("X er " + x + " og Y er " + y); // laver en JSONstring af det vi vil sende og gemmer den i data
    await fetch(koordAPI, { // fetch løser promisesen hvis stigen"koordAPI" løkkes
        method: 'POST', // hvad for en metode
        body: data // body = hvad der reelt bliver sendt, data = vores JSONstring.
    })
    console.log("Info sent");
}