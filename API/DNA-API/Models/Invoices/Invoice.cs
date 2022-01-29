using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DNA_API.Models
{
    public class Invoice
    {
        public Invoice(int iD, DateTime invoiceDate, int customerID, Boolean paid, Boolean gST)
        {
            this.ID = iD;            
            this.InvoiceDate = invoiceDate;
            this.CustomerID = customerID;
            this.Paid = paid;
            this.GST = gST;

        }

        public Invoice() 
        {

        }
        
        
        public int ID { get; set; }        
        public DateTime InvoiceDate { get; set; }
        public int CustomerID { get; set; }
        public Boolean Paid { get; set; }
        public Boolean GST { get; set; }
    }
}
