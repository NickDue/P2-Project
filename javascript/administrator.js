const tabelAPI = "http://127.0.0.1:3160/updateTabel";
const registerAPI = "http://127.0.0.1:3160/register";

async function getCases() {
    let table = document.getElementById("samarittable");
    table.innerHTML = '<tr><th>Navn</th><th>Koordinater</th><th>Dato</th><th>Information</th><th>Status</th><th>Accepter / Afslå</th></tr>'
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
        let username = para[i].number; // Tildeler et nummer til en bruger
        cell1.innerHTML = para[i].number;
        cell2.innerHTML = para[i].coordX;
        cell3.innerHTML = para[i].coordY;
        cell4.innerHTML = para[i].exInfo;
        cell5.innerHTML = para[i].status.toString();                        
}


function register(){
    fetch(registerAPI);
}