CREATE DATABASE BamazonDB;

USE BamazonDB;

CREATE TABLE Products(
  itemId INT NOT NULL AUTO_INCREMENT,
  productName VARCHAR(50) NOT NULL,
  departmentName VARCHAR(50) NOT NULL,
  Price INT default 0,
  stockQuantity INT default 0,
  PRIMARY KEY (itemId)
);

INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Xbox', 'Gaming', 500, 50);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Playstation', 'Gaming', 600, 50);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Iphone 7', 'Technology', 700, 70);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Samsung Galaxy', 'Technology', 650, 75);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Tires', 'Automotive', 80, 200);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Rims', 'Automotive', 300, 100);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Engine oil', 'Automotive', 15, 40);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Nerf ball', 'Toys', 10, 3);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Barbie doll', 'Toys', 5, 4);
INSERT INTO Products (productName, departmentName, Price, stockQuantity) VALUES ('Lego', 'Toys', 20, 2);
