CREATE DATABASE bamazon;
use bamazon;
CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (item_id),
	product_name VARCHAR(100) NULL,
	department_name VARCHAR(100) NULL,
	price DECIMAL(10,4) NULL,
	stock_quantity int

);
CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (department_id),
	department_name VARCHAR(100) NULL,
	over_head_costs	 VARCHAR(100) NULL,
	product_sales DECIMAL(10,4) NULL,
	total_profit DECIMAL(10,4) NULL

);



INSERT into products ( product_name, department_name,price,stock_quantity)
value("some stuff","some", 1000,10 );


INSERT into products ( product_name, department_name,price,stock_quantity)
value("some stuff","some", 1000,10 );



select * from products where stock_quantity > 5


UPDATE products SET stock_quantity = stock_quantity+6 where `item_id` = 6
