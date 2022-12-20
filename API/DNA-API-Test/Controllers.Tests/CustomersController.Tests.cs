using DNA_API.Controllers;
using DNA_API.DB;
using DNA_API.Models;
using DNA_API.Models.Customers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DNA_API_Test.Controllers.Tests
{
    public class CustomersControllerTests
    {
        //[Theory]
        //[InlineData(1, "Daniel", "Albert", "DNA", "dan@example.com", "1234567891", true)]
        //[InlineData(2, "Fred", "Smith", "Fred's Farming", "fred@example.com", "5555555555", true)]
        //public async Task ShouldGetCustomerByIdAsync(int id, string firstName, string lastName,
        //    string companyName, string emailAddress,
        //    string phoneNumber, bool active)
        //{
        //    // Arrange

        //    //Create an in memory Database
        //    DbContextOptions<DNADBContext> options = new DbContextOptionsBuilder<DNADBContext>()
        //        .UseInMemoryDatabase(databaseName: "ShouldGetCustomerById")
        //        .Options;

        //    //Create a mock list of customers
        //    var customerList = new List<Customer>
        //    {
        //        CreateCustomer(1,"Daniel", "Albert", "DNA", "dan@example.com","1234567891", true),
        //        CreateCustomer(2,"Fred", "Smith", "Fred's Farming", "fred@example.com","5555555555", true),
        //        CreateCustomer(3,"Greg", "Craig", "Greg's Gardening", "greg@example.com","0987654321", false),
        //    };

        //    CustomersController customersController;

        //    ActionResult<CustomerResponse> result;

        //    //Add the list of customers to the in memory database
        //    using (var context = new DNADBContext(options))
        //    {
        //        foreach (var customer in customerList)
        //        {
        //            context.Add(customer);
        //            context.SaveChanges();
        //        }

        //        customersController = new CustomersController(context);
        //        result = await customersController.getCustomerByID(1);
        //    }



        //    List<Customer> expectedCustomerList = new List<Customer>
        //    {
        //        CreateCustomer(id, firstName, lastName,
        //        companyName, emailAddress, phoneNumber, active)
        //    };

        //    ActionResult<CustomerResponse> expectedResult = new CustomerResponse(expectedCustomerList, true, "Customer Successfully Returned");

        //    Assert.Equal(expectedResult, result);







        //}

        private Customer CreateCustomer(
            int id, string firstName, string lastName,
            string companyName, string emailAddress,
            string phoneNumber, bool active)
        {
            return new Customer
            {
                Id = id,
                FirstName = firstName,
                LastName = lastName,
                CompanyName = companyName,
                EmailAddress = emailAddress,
                PhoneNumber = phoneNumber,
                Active = active
            };
        }
    }
}
