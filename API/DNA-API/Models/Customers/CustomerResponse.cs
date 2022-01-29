using System.Collections.Generic;

namespace DNA_API.Models.Customers
{
    public class CustomerResponse
    {
        //todo response model that other models inherit from
        public CustomerResponse(List<Customer> customers, bool success, string message)
        {
            this.Customers = customers;
            this.Success = success;
            this.Message = message;
        }
        public List<Customer> Customers { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}