using DNA_API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DNA_API.DB
{
    public class DNADBContext : DbContext
    {
        public DbSet<Customer> tbl_Customers { get; set; }
        public DbSet<ViewInvoice> view_Invoice { get; set; }

        public DbSet<Invoice> tbl_Invoices { get; set; }

        public DbSet<InvoiceDetail> tbl_Services { get; set; }


        public DNADBContext(DbContextOptions<DNADBContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Automatically give new Customer an Id
            modelBuilder
                .Entity<Customer>().HasKey(c => new
                {
                    c.Id
                });

            //Specify the view_Invoice view does not have a primary key and the subtotal columns data type is money
            modelBuilder
                .Entity<ViewInvoice>()
                .HasNoKey()
                .Property(vi => vi.Subtotal).HasColumnType("money");

            //invoice details
            modelBuilder
                .Entity<InvoiceDetail>()                
                .Property(id => id.Price).HasColumnType("money");
            
            modelBuilder.Entity<InvoiceDetail>()
                .HasKey(id => new { id.ID });
                           
            modelBuilder
                .Entity<Invoice>().HasKey(i => new
                {
                    i.ID
                });         
        }

    }
}
