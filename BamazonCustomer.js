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
})
 
var table = new Table({
    head: ['Item Id', 'Product Name', 'Price (US$)', 'Stock']
  , colWidths: [10, 20, 15, 10]
});

viewProducts();

function viewProducts() {
	connection.query('SELECT * FROM Products', function(err, result) {
		for (var i = 0; i < result.length; i++) {

			table.push(
	    		[result[i].itemId, result[i].productName, result[i].Price, result[i].stockQuantity]
			);
		}	
		console.log(table.toString());	
		makePurchase();
	})

}

function makePurchase() {
	inquirer.prompt([

		{
			message: 'What is the Id of the item you would like to purchase?',
			type: 'input',
			name: 'itemId'
		},

		{
			message: 'What quantity would you like to purchase?',
			type: 'input',
			name: 'quantity'
		}

	]).then(function(user){
		if (isNaN(user.itemId) || isNaN(user.quantity)) {
			console.log("Please input numeric values")
			makePurchase();
		} else {
			connection.query('SELECT Price,stockQuantity FROM Products WHERE itemId=?', [user.itemId], function(err, result) {

				var quantity = parseInt(user.quantity);
				var stockQuantity = result[0].stockQuantity
				var itemId = user.itemId;
				var price = result[0].Price;

				if (quantity < stockQuantity) {
					updateStock(quantity,stockQuantity,itemId,price);
				} else {
					console.log("Sorry, we don't have that much in stock");
					makePurchase();
				}
			});
		}	
	});
}

function updateStock(quantity,stockQuantity,itemId,price) {
	stockQuantity-= quantity;

	connection.query("UPDATE Products SET ? WHERE ?", [{stockQuantity: stockQuantity}, {itemId: itemId}], function(err, res){
	    var total = price*quantity;
	    console.log("Your total is: $" + total);
	});
	connection.end(function(err) {
		console.log('\n[Connection Terminated.]')
	});
}
