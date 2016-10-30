var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "BamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    getChoice();
})
 
var table = new Table({
    head: ['Item Id', 'Product Name', 'Department Name', 'Price (US$)', 'Stock']
  , colWidths: [10, 20, 20, 15, 10]
});

// Gets a choice from the user.
function getChoice() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
    	//Performs an action based ont eh choice made by the user
        switch(answer.action) {
            case 'View Products for Sale':
                viewProducts();
            break;
            
            case 'View Low Inventory':
                viewLowInventory();
            break;
            
            case 'Add to Inventory':
                restockInventory();
            break;
            
            case 'Add New Product':
                addNewProduct();
            break;
        }
    })
};

//Queries the entire database and places it in a table 
function viewProducts() {
	connection.query('SELECT * FROM Products', function(err, result) {
		createTable(result);
	})

}

//Returns any databse entries that have a stock value less than 5
function viewLowInventory() {
	connection.query('SELECT * FROM Products WHERE stockQuantity<5', function(err, result) {
		createTable(result);
	})
}

//Gets values from the user to restock an item
function restockInventory() {
	inquirer.prompt([

		{
			message: 'What is the Id of the item you would like to restock?',
			type: 'input',
			name: 'itemId'
		},

		{
			message: 'What quantity would you like to add?',
			type: 'input',
			name: 'quantity'
		}

	]).then(function(user){
		// checks to see if the information provided is a numeric value. if false then console log error and run the function again.
		if (isNaN(user.itemId) || isNaN(user.quantity)) {
			console.log("Please input numeric values")
			restockInventory();
		} else {
			var quantity = parseInt(user.quantity);
			var itemId = user.itemId;

			connection.query('UPDATE Products SET stockQuantity=stockQuantity + '+ quantity + ' WHERE itemId=' + itemId, function(err, result) {
				console.log("Stock has been updated\n");
				continueOrEnd();
			});
		}	
	});
}

//Gets values from the user necessary to add a new product to the database
function addNewProduct() {
	inquirer.prompt([

		{
			message: 'Product name?',
			type: 'input',
			name: 'productName'
		},

		{
			message: 'Department name of product?',
			type: 'input',
			name: 'departmentName'
		},

		{
			message: 'Price of product?',
			type: 'input',
			name: 'Price'
		},

		{
			message: 'Stock quantity?',
			type: 'input',
			name: 'stockQuantity'
		}

	]).then(function(user){
		// checks to see if the information provided is a numeric value. if false then console log error and run the function again.		
		if (isNaN(user.Price) || isNaN(user.stockQuantity)) {
			console.log("Please input numeric values")
			addNewProduct();
		} else {

			var quantity = user.stockQuantity;
			var price = user.Price;
			var productName = user.productName;
			var departmentName = user.departmentName;

			connection.query('INSERT INTO Products (productName,departmentName,Price,stockQuantity) VALUES ("'+productName+'","'+departmentName+'",'+price+',' +quantity+");", function(err, result) {
					console.log("Product has been added\n");
					continueOrEnd();
			});
		}	
	});
}

//Asks the user if they want to do another transaction or exit the program.
function continueOrEnd() {
	inquirer.prompt([

		{
			message: 'Would you like to do another task?',
			type: 'confirm',
			name: 'answer'
		}

	]).then(function(user){
		if (user.answer) {
			getChoice();
		} else {
            connection.end(function(err) {
				console.log('\n[Connection Terminated.]')
			});
		}
	});
}

//Generates a table from cli-table npm to present information returned to the user.
function createTable(result) {	
		for (var i = 0; i < result.length; i++) {

			table.push(
	    		[result[i].itemId, result[i].productName, result[i].departmentName, result[i].Price, result[i].stockQuantity]
			);
		}	
		console.log(table.toString());
		continueOrEnd();

}
