import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants';

var inquirer = require('inquirer');
var mysql = require("mysql");
//  server connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    // password: "",
    database: 'bamazon'
});


function connectingTo() {
    connection.connect(function (err, res) {
        if (err) throw err;
        select()
        //running()
    });
}

function running() {
    inquirer
        .prompt([{
            name: "item",
            type: "input",
            message: "please select Item Id that you like to purchase?",
            filter: Number,
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "count",
            type: "input",
            message: "Home many items do u need ?",
            filter: Number,
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]
        )
        .then(function (answer) {
            var item = answer.item
            var count = answer.count
            // console.log(item)
            // console.log(count)
            var query = "SELECT stock_quantity, item_id,product_name, price FROM products where ?";
            connection.query(query, { item_id: item }, function (err, res) {
                var countCheckDB = res[0].stock_quantity
                var priceDB = res[0].price
                //console.log(res)
                console.log(`
                    *********************************************************
                    coming fron DB  price ${priceDB}
                    then we getting info for countCheckDB ${countCheckDB}
                    **********************************************************`)
                if (countCheckDB < count) {
                    console.log(`
                    *********************************************************
                    we dont have that many items in stock, please go back 
                    and change the amount, currently available ${countCheckDB}
                    *********************************************************`)
                    running()
                }
                else {
                    var updateCount = countCheckDB - count
                    var userPrice = count * priceDB
                    console.log(` 
                    *************************
                    Items:${count}
                    Amount due: ${userPrice}
                    Thanks for shpping at BLABLABLA
                    *************************`)
                    //console.log(item)
                    //console.log(updateCount)
                    var query = "UPDATE products SET ? WHERE ?";
                    var some = connection.query(query, [{ stock_quantity: updateCount }, { item_id: item }], function (err, res) {
                        console.log(some.sql)
                        if (err) throw err;
                        // Log all results of the SELECT statement
                        //   console.log(res.sql);
                        //   console.log(res)
                        // console.log( "information was updated in DB")
                        connection.end()
                    });
                }
            });
        });
}


function etherMngOrUser() {
    inquirer
        .prompt({
            name: "mng",
            type: "list",
            message: "Looking lost, mng or shopper ?",
            choices: [
                "bamazon Manager",
                "departments",
                "Hey its me cash crab"
            ]
        })
        .then(function (answer) {
            switch (answer.mng) {
                case "bamazon Manager":
                    mng();
                    break;

                case "Hey its me cash crab":
                    connectingTo();
                    break;

                case "departments":
                    departments();
                    break;
            }
        });
}
//user select ends here
function mng() {
    {
        inquirer
            .prompt({
                name: "mng",
                type: "list",
                message: "Looking lost, mng or shopper ?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ]
            })
            .then(function (answer) {
                switch (answer.mng) {
                    case "View Products for Sale":
                        viewProductsForSale();
                        console.log(answer.mng)
                        break;

                    case "View Low Inventory":
                        viewLowInventory();
                        break;

                    case "Add to Inventory":
                        selectForAdd()

                        break;

                    case "Add New Product":
                        addNewProduct()
                        break;
                }
            });
    }
}
function viewProductsForSale() {


    var query = "SELECT * FROM products";
    var some = connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`
                            **********************************
                            item_id: ${res[i].item_id};
                            product_name: ${res[i].product_name};
                            department_name: ${res[i].department_name};
                            price: ${res[i].price};
                            stock_quantity: ${res[i].stock_quantity};
                            **********************************`)
        }
        backFunc()

    });
}
//end of viewProductsForSale


function viewLowInventory() {
    var query = "select * from products where stock_quantity > 5";
    var some = connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`
                            **********************************
                            ITEMS BELOW 5
                            item_id: ${res[i].item_id};
                            product_name: ${res[i].product_name};
                            department_name: ${res[i].department_name};
                            price: ${res[i].price};
                            stock_quantity: ${res[i].stock_quantity};
                            **********************************`)
        }
        backFunc()
    });
}
//viewLowInventory ends here


function addNewProduct() {

    var questions = [
        {
            type: 'input',
            name: 'product_name',
            message: 'Please enter product name ?'
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Please enter department name ?'
        },
        {
            type: 'input',
            name: 'price',
            message: 'Price of the item?',
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many itesm to add ?',
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        }
    ];
    inquirer.prompt(questions)
        .then(function (answer) {
            var product_name = answer.product_name
            var department_name = answer.department_name
            var price = answer.price
            var stock_quantity = answer.stock_quantity

            var query = "INSERT INTO products SET ?";
            var some = connection.query(query, { product_name: product_name, department_name: department_name, price: price, stock_quantity: stock_quantity }, function (err, res) {
                console.log("item was added to PROD")
                backFunc()
            });
        });


}
// end of another function 


function addToInventory() {

    inquirer
        .prompt({
            name: "back",
            type: "confirm",
            message: "you want to add stock_quantity ?"
        })
        .then(function (answer) {

            if (answer.back == true) {
                console.log("yes was selected ")
                adding()
            }
            else {
                console.log("back to Main screen.")
                backFunc()
            }
        });

    function adding() {

        var questions = [
            {
                type: 'input',
                name: 'item_id',
                message: 'Please enter product id ?',
                validate: function (value) {
                    var valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a number';
                },
                filter: Number
            },
            {
                type: 'input',
                name: 'stock_quantity',
                message: 'How many itesm to add ?',
                validate: function (value) {
                    var valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a number';
                },
                filter: Number
            }
        ];
        inquirer.prompt(questions)
            .then(function (answer) {
                var item_id = answer.item_id
                var stock_quantity = answer.stock_quantity

                console.log(item_id, stock_quantity)

                var query = 'UPDATE products SET stock_quantity = ' + ('stock_quantity') + "+" + (stock_quantity) + ' where ?';
                var testing = connection.query(query, [{ item_id: item_id }], function (res) {

                    // console.log(testing.sql)
                    console.log("information was updated")
                    backFunc()

                });

            });
    }


}
function departments() {
console.log("WPI")
backFunc()
    // var questions = [
    //     {
    //         name: "select",
    //         type: "list",
    //         message: "Looking lost, mng or shopper ?",
    //         choices: [
    //             "View Product Sales by Department",
    //             "View Low Inventory",
    //         ]
    //     }
    // ];
    // inquirer.prompt(questions)
    //     .then(function (answer) {



    //     });
}




















function backFunc() {
    inquirer
        .prompt({
            name: "back",
            type: "confirm",
            message: "back to main screen ?"
        })
        .then(function (answer) {

            if (answer.back == true) {
                console.log("yes was selected ")
                mng()
            }
            else {
                console.log("See you next time, laterr........")
                process.exit()
            }
        });
}
function selectForAdd() {
    //inventory information
    var query = "SELECT * FROM products ";
    connection.query(query, function (err, res) {
        //looping and saving info
        for (var i = 0; i < res.length; i++) {
            console.log(`
            **********************************
            item_id: ${res[i].item_id};
            product_name: ${res[i].product_name};
            department_name: ${res[i].department_name};
            price: ${res[i].price};
            stock_quantity: ${res[i].stock_quantity};
            **********************************`
            )
        }
        addToInventory()
    });

}
function select() {
    //inventory information
    var query = "SELECT * FROM products ";
    connection.query(query, function (err, res) {
        //looping and saving info
        for (var i = 0; i < res.length; i++) {
            console.log(`
            **********************************
            item_id: ${res[i].item_id};
            product_name: ${res[i].product_name};
            department_name: ${res[i].department_name};
            price: ${res[i].price};
            stock_quantity: ${res[i].stock_quantity};
            **********************************`
            )
        }
        running();
    });

}
//select end here

//mng ends here
etherMngOrUser()