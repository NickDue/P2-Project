const tabelAPI = "http://127.0.0.1:3160/updateTabel";
const acceptAPI = "http://127.0.0.1:3160/accept"; 

async function getCases() {
    let table = document.getElementById("samarittable");
    table.innerHTML = '<tr>' + '<th>Case nr.</th>' + '<th>X-Koordinat</th>' + '<th>Y-Koordinat</th>' + '<th>Dato</th>' + '<th>Information</th>' + '<th>Status</th>' + '<th>Samarit</th>' + '<th>Accepter</th>' + '</tr>'
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
        let cell8 = row.insertCell();
        let number = para[i].number; // Tildeler et nummer til en bruger
        cell1.innerHTML = para[i].number + 1;
        cell2.innerHTML = para[i].coordX;
        cell3.innerHTML = para[i].coordY;
        cell4.innerHTML = para[i].date;
        cell5.innerHTML = para[i].exInfo;
        cell6.innerHTML = para[i].status.toString(); // Status for casen
        cell7.innerHTML = para[i].samarit;
        if(para[i].status.toLowerCase() == "ledig") {
            cell8.innerHTML = '<button action="admin" type="submit" id=\''+number+'\' onClick="acceptButt(\''+number+'\')" > Accept </button>' ; // Giver en accept knap \''+XXX+'\' lader os sende en variabel i et funktionskald i HTML                        
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

