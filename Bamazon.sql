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
