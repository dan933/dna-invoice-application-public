using DNA_API.DB;
using DNA_API.Helpers;
using DNA_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DNA_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class InvoicesController : Controller
    {
        private readonly DNADBContext _context;

        public InvoicesController(DNADBContext context)
        {
            _context = context;
        }

        //get all Invoices general overview
        [HttpGet]
        [Route("get-invoices")]
        public async Task<ActionResult<IEnumerable<ViewInvoice>>> GetInvoices()
        {

            //todo functions are not created in the controller but in a seperate class to make the code cleaner maybe in a methods folder and files for each controller
            var invoices = await _context.view_Invoice.ToListAsync();

            return Ok(invoices);
        }

        [HttpGet]
        [Route("invoice/{id:int}")]
        public async Task<ActionResult<Response<Invoice>>> getInvoiceByID(int id){
            try
            {
                Response<Invoice> response;

                var invoice = await _context.tbl_Invoices
                .FindAsync(id);

                var message = invoice != null ? "invoice header successfully returned" : "invoice not found";

                var isSuccess = invoice != null ? true : false;

                response = new Response<Invoice>(invoice, isSuccess, message);

                return Ok(response);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex);
            }
        }

        [HttpGet]
        [Route("customer/{id:int}")]
        public async Task<ActionResult<Response<List<ViewInvoice>>>> getCustomerInvoices(int id,[FromQuery] PagedRequest pagedRequest){
            try
            {
                PagedResponse<List<ViewInvoice>> response;

                 List<ViewInvoice> customerInvoices;                

                var isCustomer = await _context.tbl_Customers
                .FirstOrDefaultAsync(customer => customer.Id == id) != null ? true : false;

                if(isCustomer){

                    var search = PaginationHelper.CustomerInvoicesQuery(pagedRequest.Search);

                    var orderByFunc = PaginationHelper.SortCustomerInvoices(pagedRequest.Sort);

                    int pageNumber = (int)(pagedRequest.PageNumber != null ? pagedRequest.PageNumber : 1);

                    int totalRecords;

                    int pageSize = (int)(pagedRequest.PageSize != null ? pagedRequest.PageSize : 10);

                    if(pagedRequest.AscDesc == true){

                        customerInvoices = await _context.view_Invoice
                        .Where(invoice => invoice.CustomerId == id)
                        .Where(search)                        
                        .OrderBy(orderByFunc)
                        .Skip(((pageNumber - 1) * pageSize))
                        .Take(pageSize)                    
                        .ToListAsync();

                        totalRecords = await _context.view_Invoice
                        .Where(invoice => invoice.CustomerId == id)
                        .Where(search)
                        .CountAsync();

                    }else {

                        customerInvoices = await _context.view_Invoice
                        .Where(invoice => invoice.CustomerId == id)
                        .Where(search)
                        .OrderByDescending(orderByFunc)
                        .Skip(((pageNumber - 1) * pageSize))
                        .Take(pageSize)                    
                        .ToListAsync();

                        totalRecords = await _context.view_Invoice
                        .Where(invoice => invoice.CustomerId == id)
                        .Where(search)
                        .CountAsync();

                    }


                    response = new PagedResponse<List<ViewInvoice>>(customerInvoices, true, "Customer ID: " + id + " invoices retrieved", pageNumber, pageSize, totalRecords);
                    return Ok(response);

                }

                response = new PagedResponse<List<ViewInvoice>>(null, false, "Customer ID: " + id + " does not exist", 0, 0, 0);
                return Ok(response);

            }

            catch (Exception ex)
            {
                
                return StatusCode(500, ex);
            }
            
        }


        //Create Invoice
        [HttpPost]
        [Route("create-invoice")]
        public async Task<ActionResult<Response<Invoice>>> CreateInvoice([FromBody] Invoice invoice)
        {
            try
            {
                Response<Invoice> invoiceResponse;

                //check that an invoice doesn't already exist
                var isInvoice = await _context.tbl_Invoices
                    .Where(i => i.ID == invoice.ID)
                    .FirstOrDefaultAsync();

                if(isInvoice != null)
                {
                    invoiceResponse = new Response<Invoice>(null, false, "Duplicate Invoice Number");
                    return Ok(invoiceResponse);
                }

                var isCustomer = await _context.tbl_Customers
                    .Where(c => c.Id == invoice.CustomerID)
                    .FirstOrDefaultAsync();

                if (isCustomer == null)
                {
                    invoiceResponse = new Response<Invoice>(null, false, "Customer ID not found");
                    return Ok(invoiceResponse);
                }

                if (isInvoice == null && isCustomer != null)
                {
                    _context.tbl_Invoices.Add(invoice);
                    await _context.SaveChangesAsync();

                    invoiceResponse = new(invoice, true, "Invoice Created");


                    return Ok(invoiceResponse);
                }

                

                

                invoiceResponse = new Response<Invoice>(null, false, "Something went wrong");
                return Ok(invoiceResponse);

            //source: https://code-maze.com/global-error-handling-aspnetcore/
            }
            catch (Exception ex)
            {                
                return StatusCode(500, ex);
            }                        
        }

        //Edit Invoice
        [HttpPut]
        [Route("edit-invoice")]
        public async Task<ActionResult<Response<Invoice>>> EditInvoice([FromBody] Invoice invoice){

            try
            {
                //error checking 
                //if invoice does not exist
                //if customer does not exist
                var invoiceRecord = await _context.tbl_Invoices
                .FindAsync(invoice.ID);
                
                invoiceRecord.CustomerID = invoice.CustomerID;
                invoiceRecord.GST = invoice.GST;
                invoiceRecord.Paid = invoice.Paid;
                invoiceRecord.InvoiceDate = invoice.InvoiceDate;

                await _context.SaveChangesAsync();

                var response = new Response<Invoice>(invoiceRecord, true, "Invoice successfully changed");
                return Ok(response);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex);
            }
            
        }

        [HttpDelete]
        [Route("delete-invoice")]
        public async Task<ActionResult<Response<List<Invoice>>>> DeleteInvoice([FromBody] List<int> invoiceIDList){
            try
            {
                //get invoice details list attached to invoices being deleted
                var invoiceDetails = await _context.tbl_Services
                .Where(i => invoiceIDList.Contains(i.InvoiceID))
                .ToListAsync();

                //remve invoice details record
                invoiceDetails.ForEach(i => _context.tbl_Services.Remove(i));

                await _context.SaveChangesAsync();

                var Invoices = await _context.tbl_Invoices
                .Where(i => invoiceIDList.Contains(i.ID))
                .ToListAsync();

                Invoices.ForEach(i => _context.tbl_Invoices.Remove(i));
                
                await _context.SaveChangesAsync();

                

                var response = new Response<List<Invoice>>(Invoices,true,"Invoices Deleted");
                _context.Dispose();

                return Ok(response);

            }
            catch (Exception ex)
            {

                return StatusCode(500, ex);
            }
        }


        //Create Invoice Details
        [HttpPost]
        [Route("createInvoiceDetails")]
        public async Task<ActionResult<InvoiceDetailsResponse>> AddInvoiceDetails([FromBody] List<InvoiceDetail> invoiceDetails)
        {
            try
            {
                InvoiceDetailsResponse invoiceDetailsResponse;

                var isSameId = invoiceDetails[0].InvoiceID;
                
                //check that all invoice details have the same id
                foreach (var item in invoiceDetails)
                {
                    if (isSameId != item.InvoiceID)
                    {
                        Console.WriteLine(item);
                        invoiceDetailsResponse = new(null, false, "Invoice Numbers do not match");
                        return Ok(invoiceDetailsResponse);
                    } 
                }

                
                //check if invoice exists
                var isInvoiceNumber =
                    await _context.tbl_Invoices
                    //todo this needs to be a for loop to itterate over the whole list
                    .Where(id => id.ID == invoiceDetails[0].InvoiceID)                    
                    .FirstOrDefaultAsync();

                //If invoice exists
                if (isInvoiceNumber != null)
                {
                    //add and save to db
                    foreach (InvoiceDetail element in invoiceDetails)
                    {
                        _context.tbl_Services.Add(element);
                    }

                    await _context.SaveChangesAsync();

                    invoiceDetailsResponse = new(invoiceDetails, true, "Invoice Details Added");

                    return Ok(invoiceDetailsResponse);
                }

                invoiceDetailsResponse = new(null, false, "Invoice Number does not exist");

                return Ok(invoiceDetailsResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }     
        }


        [HttpGet]
        [Route("get-invoice-details/{id:int}")]
        public async Task<ActionResult<InvoiceDetailsResponse>> GetInvoiceDetails(int id)
        {
            try
            {
                var invoiceDetails = await _context.tbl_Services
                .Where(item => item.InvoiceID == id)
                .ToListAsync();

                var response = new InvoiceDetailsResponse(invoiceDetails, true,"Successfully retrieved invoice details for ID: "+id);

                //get invoice details by ID
                return Ok(response);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500,ex);
            }
            
        }


        [HttpPut]
        [Route("edit-invoice-details")]
        public async Task<ActionResult<InvoiceDetailsResponse>> EditInvoiceDetails([FromBody] List<InvoiceDetail> invoiceDetailsList){
            try
            {
                //get list of ID's to itterate over
                List<int> invoiceDetailsIDList = new List<int>();
                invoiceDetailsList.ForEach(item => invoiceDetailsIDList.Add(item.ID));

                //get detail records that match id's
                var invoiceDetails = await _context.tbl_Services
                .Where(i => invoiceDetailsIDList.Contains(i.ID))
                .ToListAsync();
                
                //iterate through the id's of from the body of the request
                InvoiceDetail detailRecord;
                invoiceDetailsList.ForEach((i) =>
                {
                    //find the id in the database
                    detailRecord = invoiceDetails.Find(item => item.ID == i.ID);

                    //if there is a match
                    if(detailRecord != null)
                    {
                        //change the record with the one from the request body
                        detailRecord.Details = i.Details;
                        detailRecord.Price = i.Price;
                        detailRecord.Qty = i.Qty;

                        //Save the changes
                        _context.SaveChanges();
                    }
                    

                });

                

                //return the response
                var response = new InvoiceDetailsResponse(invoiceDetailsList, true, "successfully edited detail records please note ID's not contained in the database will be ignored");

                return Ok(response);

            } catch(Exception e){

                return StatusCode(500, e); 
            }

            
        }

        [HttpDelete]
        [Route("delete-invoice-details")]
        public async Task<ActionResult<InvoiceDetailsResponse>> DeleteInvoiceDetails([FromBody] List<int> invoiceDetailsID)
        {
            try
            {
                var InvoiceDetails = await _context.tbl_Services
                .Where(i => invoiceDetailsID.Contains(i.ID))
                .ToListAsync();

                InvoiceDetails.ForEach(i => _context.tbl_Services.Remove(i));
                await _context.SaveChangesAsync();

                _context.Dispose();

                var response = new InvoiceDetailsResponse(InvoiceDetails, true, "Successfully deleted invoice item");
                return Ok(response);
            }

            catch (Exception ex)
            {

                return StatusCode(500, ex);
            }
        }
    }
}
