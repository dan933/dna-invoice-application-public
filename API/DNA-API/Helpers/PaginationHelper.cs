using System;
using System.Linq.Expressions;
using DNA_API.Models;

namespace DNA_API.Helpers
{
    public class PaginationHelper
    {
        internal static Expression<Func<ViewInvoice, bool>> CustomerInvoicesQuery(string searchString) {

            Expression<Func<ViewInvoice, bool>> search = null; 

            DateTime dateValue;          

            DateTime.TryParse(searchString, out dateValue);

            if (searchString == "" || searchString == null)
            {
                search = item => item.Id == item.Id;               

            } else
            {
                search = item => item.Id.ToString().StartsWith(searchString)
                || item.Subtotal.ToString().StartsWith(searchString)
                || dateValue.Date == item.InvoiceDate.Date;
            }           

            return search;

        }
        internal static Expression<Func<ViewInvoice, Object>> SortCustomerInvoices(string sortString) {

            Expression<Func<ViewInvoice, Object>> orderByFunc = null;

            switch (sortString)
                    {
                        case "gst":
                            orderByFunc = item => item.GST;
                            break;

                        case "invoiceDate":
                            orderByFunc = item => item.InvoiceDate;
                            break;

                        case "paid":
                            orderByFunc = item => item.Paid;
                            break;

                        case "subtotal":
                            orderByFunc = item => item.Subtotal;
                            break;                     
                        
                        default:
                            orderByFunc = item => item.Id;
                            break;
                    }

            return orderByFunc;
        }
    }
    
}