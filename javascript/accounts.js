const accountsAPI = "http://127.0.0.1:3160/accounts";

async function getAccounts() {
    let table = document.getElementById("accounttable");
    table.innerHTML = '<tr>' + '<th>ID</th>' + '<th>Navn</th>' + '<th>Rettigheder</th>'+'</tr>'
    let element = await fetch(accountsAPI);
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
        cell1.innerHTML = para[i].id;
        cell2.innerHTML = para[i].name;
        cell3.innerHTML = para[i].permissions;                   
}

function deleteAccount(){
    let accountId = prompt("Please enter ID of the desired account you want to delete");
    deleteAccountServerSide(accountId);
    console.log("Account with id: " + accountId + " deleted");
    
}

const deleteAccountAPI = "http://127.0.0.1:3160/deleteAccount"

async function deleteAccountServerSide(accountId) {
    let data = JSON.stringify(accountId);
    await fetch(deleteAccountAPI, {
        method: "POST",
        body: data
    })
}