using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DNA_API.Models
{
    public class InvoiceDetailsResponse
    {
        public List<InvoiceDetail> InvoiceDetails { get; set; }
        public Boolean Success { get; set; }
        public string Message { get; set; }

        public InvoiceDetailsResponse(List<InvoiceDetail> invoiceDetails, Boolean success, string message)
        {
            InvoiceDetails = invoiceDetails;
            Success = success;
            Message = message;
        }
    }
}
