using System;

namespace DNA_API.Models
{
    //source https://codewithmukesh.com/blog/pagination-in-aspnet-core-webapi/
    public class PagedRequest
    {
        #nullable enable
        public int? PageSize { get; set; }
        public int? PageNumber { get; set; }
        public Boolean? isActive { get; set; }

        public string? Sort { get; set; }

        public Boolean AscDesc { get; set; }

        public string? Search { get; set; }

        public PagedRequest()
        {
            
        }

        public PagedRequest(
            int? pageSize, int? pageNumber,
            Boolean isActive, string sort,
            Boolean ascDesc, string? search
            )
        {
            this.PageSize = pageSize;
            this.PageNumber = pageNumber;
            this.isActive = isActive;
            this.Sort = sort;
            this.AscDesc = ascDesc;
            this.Search = search;
        }
    }

}