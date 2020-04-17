function addExp() {
    let right_now = new Date();
    let year = right_now.getFullYear();
    let month = right_now.getMonth()+1;
    let day = right_now.getDate();
    let name = prompt("Please type in your name", "Name");
    let item = prompt("Please type in the item", "Item");
    let date = prompt("Please enter date", day + "-" + month + "-" + year);
    let cash = prompt("Please enter money used", "Money");
    let curr = prompt("Please enter currency used", "Currency");
    update_table(name, item, date, cash, curr);
}

function update_table(name, item, date, cash, curr) {
    let table = document.getElementById("table");
    let row = table.insertRow();
    let name_cell = row.insertCell();
    let item_cell = row.insertCell();
    let date_cell = row.insertCell();
    let cash_cell = row.insertCell();
    let curr_cell = row.insertCell();
    name_cell.innerHTML = name;
    item_cell.innerHTML = item;
    date_cell.innerHTML = date;
    cash_cell.innerHTML = cash;
    curr_cell.innerHTML = curr;
}

function see_balance() {
    let total = 0;
    //Gets table
    let oTable = document.getElementById("table");

    //Gets columns
    let col_length = oTable.column.length;

    //loops through rows
    for (let i = 0; i < col_length; i++) {
        let oCells = oTable.column.item(i).cells;
        let cell_length = oCells.length;
        for (let j = 0; j < cell_length; j++) {
            total += oCells.item(j);
        }
    }
    console.log(total);
}
