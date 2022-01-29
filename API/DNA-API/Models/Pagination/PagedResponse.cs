using System;

namespace DNA_API.Models
{
    //source https://codewithmukesh.com/blog/pagination-in-aspnet-core-webapi/
    public class PagedResponse<T1> : Response<T1>
    {
        public int? PageSize { get; set; }        
        public int? PageNumber { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }

        public PagedResponse(System.Collections.Generic.List<Customer> customers)
        {
            
        }

        public PagedResponse(T1 data, Boolean success,string message, int pageNumber, int pageSize, int totalRecords)
        {
            this.PageSize = pageSize;
            this.TotalRecords = totalRecords;
            this.TotalPages = (int)Math.Ceiling(((decimal)totalRecords / (decimal)pageSize));
            this.PageNumber = pageNumber;            
            this.Data = data;
            this.Success = success;
            this.Message = message;
        }


    }

    // this.Data = data;
    //         this.Success = success;
    //         this.Message = message;
    
}