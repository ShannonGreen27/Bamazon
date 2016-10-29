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

function getChoice() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
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

function viewProducts() {
	connection.query('SELECT * FROM Products', function(err, result) {
		for (var i = 0; i < result.length; i++) {

			table.push(
	    		[result[i].itemId, result[i].productName, result[i].departmentName, result[i].Price, result[i].stockQuantity]
			);
		}	
		console.log(table.toString());	
	})

}

function viewLowInventory() {
	connection.query('SELECT * FROM Products WHERE stockQuantity<5', function(err, result) {
		for (var i = 0; i < result.length; i++) {

			table.push(
	    		[result[i].itemId, result[i].productName, result[i].departmentName, result[i].Price, result[i].stockQuantity]
			);
		}	
		console.log(table.toString());	
	})

}


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
		if (isNaN(user.itemId) || isNaN(user.quantity)) {
			console.log("Please input numeric values")
			restockInventory();
		} else {
			var quantity = parseInt(user.quantity);
			var itemId = user.itemId;

			connection.query('UPDATE Products SET stockQuantity=stockQuantity + '+ quantity + ' WHERE itemId=' + itemId, function(err, result) {
			});
		}	
	});
}

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
		if (isNaN(user.Price) || isNaN(user.stockQuantity)) {
			console.log("Please input numeric values")
			addNewProduct();
		} else {
			var quantity = parseInt(user.stockQuantity);
			var price = user.Price;
			var productName = user.productName;
			var departmentName = user.departmentName;

			connection.query("INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES "+(productName, departmentName, price, quantity), function(err, result) {
				console.log(productName);
				console.log(typeof productName);
				console.log(departmentName);
				console.log(typeof departmentName);
				console.log(price);
				console.log(typeof price);
				console.log(quantity);
				console.log(typeof quantity);
				console.log(result);
			});
		}	
	});
}


