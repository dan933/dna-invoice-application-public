using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DNA_API.Models
{
    public class ViewInvoice
    {        
        public int Id { get; set; }       
        public DateTime InvoiceDate { get; set; }
        public int CustomerId { get; set; }
        public decimal? Subtotal { get; set; }
        public Boolean Paid { get; set; }
        public Boolean GST { get; set; }
    }
}
