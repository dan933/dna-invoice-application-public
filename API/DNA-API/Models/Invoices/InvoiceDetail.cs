using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DNA_API.Models
{
    public class InvoiceDetail
    {
        public int ID { get; set; }
        public int InvoiceID { get; set; }
        public string Details { get; set; }
        public int Qty { get; set; }
        public float Price { get; set; }
    }
}
