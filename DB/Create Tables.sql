DROP TABLE IF EXISTS tbl_Services

GO

DROP TABLE IF EXISTS tbl_Invoices

GO

DROP TABLE IF EXISTS tbl_Customers

GO

DROP VIEW IF EXISTS view_Invoice

CREATE TABLE tbl_Customers (
	ID INT IDENTITY (1,1) NOT NULL,
	FirstName NVARCHAR(50) NOT NULL,
	LastName NVARCHAR(50) NOT NULL,
	CompanyName NVARCHAR(100),
	EmailAddress NVARCHAR(200) NOT NULL,
	PhoneNumber Nvarchar(50),
	Active BIT NOT NULL,
	PRIMARY KEY (ID)
)

GO

CREATE TABLE tbl_Invoices (
	ID INT IDENTITY (1,1) NOT NULL,
	InvoiceDate DateTime NOT NULL,	
	CustomerID INT NOT NULL,
	Paid BIT NULL,
	GST BIT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (CustomerID) REFERENCES tbl_Customers(ID),
)

GO

CREATE TABLE tbl_Services (
	ID INT IDENTITY (1,1) NOT NULL,
	InvoiceID int NOT NULL,
	Details Nvarchar(300) NOT NULL,
	Qty INT NOT NULL,
	Price MONEY NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (InvoiceID) REFERENCES tbl_Invoices (ID)
);

GO

CREATE VIEW view_Invoice
AS 

SELECT INV.ID, Inv.InvoiceDate, Inv.CustomerID, Inv.Paid, Inv.GST, SUM(Ser.Price * Ser.Qty) as Subtotal
FROM tbl_Invoices AS Inv
INNER JOIN tbl_Customers AS Cust ON Inv.CustomerID = Cust.ID
LEFT JOIN tbl_Services AS Ser ON Inv.ID = Ser.InvoiceID
GROUP BY INV.ID, Inv.InvoiceDate, Inv.CustomerID, Inv.Paid, Inv.GST;