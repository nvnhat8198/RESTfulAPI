create database myDB;
use myDB;
CREATE TABLE Persons (
    ID int not null auto_increment,
	FullName nvarchar(255) not null ,
	Email nvarchar(255) not null unique,
    Password nvarchar(255) not null,
    primary key (ID)
)

#---------------------------------------------------#
DELIMITER $$
USE `myDB`$$
CREATE PROCEDURE AddPerson(in FullName varchar(255), in Email varchar(255), in Password varchar(255))
BEGIN
	insert into Persons values (null, FullName, Email, Password);
END;$$
DELIMITER ;

DELIMITER $$
USE `myDB`$$
CREATE PROCEDURE GetPersonWithEmail(in Email varchar(255))
BEGIN
	select * from Persons p where p.Email = Email;
END;$$
DELIMITER ;

DELIMITER $$
USE `myDB`$$
CREATE PROCEDURE GetPersonWithID(in ID int(11))
BEGIN
	select * from Persons p where p.ID = ID;
END;$$
DELIMITER ;

