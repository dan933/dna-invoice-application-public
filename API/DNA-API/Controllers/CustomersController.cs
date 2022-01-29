using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DNA_API.DB;
using DNA_API.Models;
using Microsoft.Data.SqlClient;
using DNA_API.Models.Customers;
using System.Reflection;
using System.Linq.Expressions;
using System.Text.RegularExpressions;

namespace DNA_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CustomersController : Controller
    {
        private readonly DNADBContext _context;

        public CustomersController(DNADBContext context)
        {
            _context = context;
        }
     
        [HttpPost]
        public async Task<ActionResult<CustomerResponse>> createCustomers([FromBody] List<Customer> customers)
        {
            try
            {
                 //todo check if customer already exists with email address
                customers.ForEach(i => _context.tbl_Customers.Add(i));            
                await _context.SaveChangesAsync();

                var response = new CustomerResponse(customers,true,"Customers successfully added");

                return Ok(response);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex);
            }
            
        }

        //edit customers
        [HttpPut]
        public async Task<ActionResult<CustomerResponse>> editCustomers(List<Customer> customers){
            try
            {
                var customersID = new List<int>();
                customers.ForEach(c => customersID.Add(c.Id));

                var customerList = await _context.tbl_Customers
                .Where(c => customersID.Contains(c.Id))
                .ToListAsync();

                Customer customer;
                customers.ForEach((c) =>
                {
                    customer = customerList.Find(item =>item.Id == c.Id);

                    if(customer != null){
                        customer.FirstName = c.FirstName;
                        customer.LastName = c.LastName;
                        customer.CompanyName = c.CompanyName;
                        customer.EmailAddress = c.EmailAddress;
                        customer.PhoneNumber = c.PhoneNumber;
                        customer.Active = c.Active;

                        _context.SaveChanges();
                    }
                });

                

                var response = new CustomerResponse(customerList,true,"Edit Customer Successful");

                _context.Dispose();

                return (response);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex);
            }
        }

        [HttpDelete]
        public async Task<ActionResult<CustomerResponse>> deleteCustomers(List<int> customerIDList){
            try
            {
                //Get customers to delete
                var customersToDelete = await _context.tbl_Customers
                .Where(customer => customerIDList.Contains(customer.Id))
                .ToListAsync();

                //Get Invoices Associated with Customers
                var invoicesToDelete = await _context.tbl_Invoices
                .Where(invoice => customerIDList.Contains(invoice.CustomerID))
                .ToListAsync();
                

                //Get InvoiceDetails Associated with Customers
                var invoiceDetilsToDelete = await _context.tbl_Services
                .Where(invoiceDetail => invoicesToDelete.Select(i => i.ID).Contains(invoiceDetail.InvoiceID))
                .ToListAsync();

                //Delete invoiceDetails records
                _context.tbl_Services.RemoveRange(invoiceDetilsToDelete);
                _context.SaveChanges();

                //Delete Invoice records
                _context.tbl_Invoices.RemoveRange(invoicesToDelete);
                _context.SaveChanges();

                //Delete Customer records
                _context.tbl_Customers.RemoveRange(customersToDelete);
                _context.SaveChanges();
                _context.Dispose();

                var response = new CustomerResponse(customersToDelete, true, "Customer Deleted");
                return Ok(response);
            }
            catch (Exception exc)
            {
                
                return StatusCode(500,exc);
            }
        }

        // GET: Customers
        [HttpGet]
        public async Task<ActionResult<PagedResponse<List<Customer>>>> getCustomers([FromQuery] PagedRequest pagedRequest)
        {
            try
            {
                List<Customer> customers;

                //source https://stackoverflow.com/questions/2728340/how-can-i-do-an-orderby-with-a-dynamic-string-parameter

                Expression<Func<Customer, Object>> orderByFunc = null;
                Expression<Func<Customer, bool>> search = null;


                if (pagedRequest.Search == "" || pagedRequest.Search == null)
                {
                    search = item => item.Id == item.Id;

                }else{

                    search = item => 
                    item.Id.ToString().StartsWith(pagedRequest.Search) || item.FirstName.StartsWith(pagedRequest.Search)
                    || item.LastName.StartsWith(pagedRequest.Search) || item.CompanyName.StartsWith(pagedRequest.Search)
                    || item.EmailAddress.StartsWith(pagedRequest.Search) || item.PhoneNumber.StartsWith(pagedRequest.Search);
                }

                Console.WriteLine(pagedRequest.Search);


                switch (pagedRequest.Sort)
                {
                    case "active":
                        orderByFunc = item => item.Active;
                        break;

                    case "companyName":
                        orderByFunc = item => item.CompanyName;
                        break;

                    case "emailAddress":
                        orderByFunc = item => item.EmailAddress;
                        break;

                    case "firstName":
                        orderByFunc = item => item.FirstName;
                        break;

                    case "lastName":
                        orderByFunc = item => item.LastName;
                        break;

                    case "phoneNumber":
                        orderByFunc = item => item.PhoneNumber;
                        break;

                    default:
                        orderByFunc = item => item.Id;
                        break;
                }

                int pageNumber = (int)(pagedRequest.PageNumber != null ? pagedRequest.PageNumber : 1);

                int totalRecords;

                int pageSize = (int)(pagedRequest.PageSize != null ? pagedRequest.PageSize : 10);

                if( pagedRequest.isActive == null && pagedRequest.AscDesc == true) {
                    //source https://codewithmukesh.com/blog/pagination-in-aspnet-core-webapi/
                    customers = await _context.tbl_Customers
                    .Where(search)
                    .OrderBy(orderByFunc)
                    .Skip(((pageNumber - 1) * pageSize))
                    .Take(pageSize)
                    .ToListAsync();

                     totalRecords = await _context.tbl_Customers
                     .Where(search)                    
                    .CountAsync();

                }else if( pagedRequest.isActive == null && pagedRequest.AscDesc == false ){

                    //source https://codewithmukesh.com/blog/pagination-in-aspnet-core-webapi/
                    customers = await _context.tbl_Customers
                    .Where(search)
                    .OrderByDescending(orderByFunc)
                    .Skip(((pageNumber - 1) * pageSize))
                    .Take(pageSize)
                    .ToListAsync();

                    totalRecords = await _context.tbl_Customers
                    .Where(search)
                    .CountAsync();

                }else if (pagedRequest.AscDesc == true){

                    //source https://codewithmukesh.com/blog/pagination-in-aspnet-core-webapi/
                    customers = await _context.tbl_Customers
                    .Where(customer => customer.Active == pagedRequest.isActive)
                    .Where(search)
                    .OrderBy(orderByFunc)
                    .Skip(((pageNumber - 1) * pageSize))
                    .Take(pageSize)
                    .ToListAsync();

                    totalRecords = await _context.tbl_Customers
                    .Where(customer => customer.Active == pagedRequest.isActive)
                    .Where(search)
                    .CountAsync();


                }else {

                    //source https://codewithmukesh.com/blog/pagination-in-aspnet-core-webapi/
                    customers = await _context.tbl_Customers
                    .Where(customer => customer.Active == pagedRequest.isActive)
                    .Where(search)
                    .OrderByDescending(orderByFunc)
                    .Skip(((pageNumber - 1) * pageSize))
                    .Take(pageSize)
                    .ToListAsync();

                    totalRecords = await _context.tbl_Customers
                    .Where(customer => customer.Active == pagedRequest.isActive)
                    .Where(search)
                    .CountAsync();
                }              

                var pagedResponse = new PagedResponse<List<Customer>>(
                    customers, true, "Customers successfully returned", pageNumber, pageSize, totalRecords);

                return Ok(pagedResponse);                
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex);
            }
           
        }

        //todo change this endpoint
        //Route("customer-invoices)
        //new model CustomerInvoices
        //Create a Response model

        [HttpGet]
        [Route("{id:int}")]
        public async Task<ActionResult<CustomerResponse>> getCustomerByID(int id){

            try
            {
                var customer = await _context.tbl_Customers
                .FindAsync(id);

                Response<Customer> response;

                if (customer != null)
                {
                    response = new Response<Customer>(customer, true, "Customer Successfully Returned");
                }
                else
                {
                    response = new Response<Customer>(customer, false, "Customer not found");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
                
        }
    }
}
