const tabelAPI = "http://127.0.0.1:3160/updateTabel";
const registerAPI = "http://127.0.0.1:3160/register";

async function getCases() {
    let table = document.getElementById("samarittable");
    table.innerHTML = '<tr>' + '<th>Case-nr</th>' + '<th>X-Koordinat</th>' + '<th>Y-Koordinat</th>' + '<th>Dato</th>' + '<th>Information</th>' + '<th>Status</th>' + '<th>Ny status</th>' + '</tr>'
    let element = await fetch(tabelAPI);
    let para = await element.json();
    for (let i = 0; i < para.length; i++) {
        updateTabel(para,i,table);
    }
}

function updateTabel(para,i,table){
    let row = table.insertRow(); // adding new tr
        let cell1 = row.insertCell(); //adding new td
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        let cell4 = row.insertCell();
        let cell5 = row.insertCell();
        let cell6 = row.insertCell();
        let cell7 = row.insertCell();
        let casenr = para[i].number; // Tildeler et nummer til en bruger
        cell1.innerHTML = para[i].number;
        cell2.innerHTML = para[i].coordX;  // Rapportørens X koordinat
        cell3.innerHTML = para[i].coordY;  // Rapportørens Y koordinat
        cell4.innerHTML = para[i].date ;  //Dato for casens oprettelse
        cell5.innerHTML = para[i].exInfo;  // Evt. yderligere information
        cell6.innerHTML = para[i].status.toString();  // Status for case
        cell7.innerHTML = '<button id=\''+casenr+'\' onClick="ledigButt(\''+casenr+'\')" > Ledig </button> <button id=\''+casenr+'\' onClick="optagetButt(\''+casenr+'\')" > Optaget </button> <button id=\''+casenr+'\' onClick="afslutButt(\''+casenr+'\')" > Afsluttet </button>';                        
}

const adminStatusAPI = "http://127.0.0.1:3160/adminStatus";

async function ledigButt (number) {
    let array= []   
    array.push(number);
    array.push(55);
    await fetch(adminStatusAPI, { // fetch løser promisen hvis stigen "acceptAPI" lykkedes
        method: 'POST', // hvad for en metode
        body: JSON.stringify(array) // body = hvad der reelt bliver sendt, data = vores JSONstring
    })
}

async function optagetButt(number){
    let array= [] 
    array.push(number);
    array.push(88);
    await fetch(adminStatusAPI, { // fetch løser promisen hvis stigen "acceptAPI" lykkedes
        method: 'POST', // hvad for en metode
        body: JSON.stringify(array) // body = hvad der reelt bliver sendt, data = vores JSONstring
    })
}

async function afslutButt(number) {
    let array= [] // laver en JSONstring af det vi vil sende og gemmer den i data
    array.push(number);
    array.push(24);
    await fetch(adminStatusAPI, { // fetch løser promisen hvis stigen "acceptAPI" lykkedes
        method: 'POST', // hvad for en metode
        body: JSON.stringify(array) // body = hvad der reelt bliver sendt, data = vores JSONstring
    })
}

