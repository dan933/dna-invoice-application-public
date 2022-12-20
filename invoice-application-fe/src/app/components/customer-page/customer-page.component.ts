import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';

import { Customer } from 'src/app/models/customers-model';

import { CustomersService } from 'src/app/services/customers.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ToggleSortService } from 'src/app/services/toggle-sort.service';
// import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';

export interface CustomerInvoices {
  invoiceNumber: string;
  date: string;
  company: string;
  subTotal: string;
  paid: boolean;
  gst: boolean;
}

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.scss']
})

export class CustomerPageComponent implements OnInit {

  id: number = 0;
  customerInformation: any;


  dataSource: any = [];
  displayedColumns: string[] = ['id', 'invoiceDate', 'subtotal', 'paid', 'gst'];
  customerInvoices: any = [];

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  totalRecords = 0;
  pageNumber = 0;
  searchFilter = "";

  query: any = {
    PageSize: this.pageSize,
    PageNumber: this.pageNumber + 1,
    Search:""
  }


  constructor(
    public customersService: CustomersService,
    public invoiceService: InvoicesService,
    private route: ActivatedRoute,
    private router: Router,
    public invoicesService: InvoicesService,
    private _snackBar: MatSnackBar,
    public toggleService:ToggleSortService,
    public dialog: MatDialog
  ) { }



  ngOnInit(): void {

    this.getCustomerID()

    this.getCustomerDetails()

    this.getCustomerInvoices()
  }

  openDeleteCustomerDialog():void {
    const dialogRef = this.dialog.open(DeleteCustomerComponent, {
      data:{customerId:this.id}
    });
  }

  openEditCustomerDialog():void{
    const dialogRef = this.dialog.open(EditCustomerComponent, {
      data:{customerInformation:this.customerInformation}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.id = result.customers[0].id;
        this.getCustomerDetails();
    })
  }

  //navigate to specific customer page
  navInvoice(id: any) {
    this.router.navigate([`/invoice/${id}`])
  }

  //get customer id
  getCustomerID() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  //get customer details
  getCustomerDetails() {
    this.customersService.getCustomer(this.id)
      .subscribe((data) => {
        this.customerInformation = data;
        this.customerInformation = this.customerInformation.data;
        this.customerInformation.customerCode = this.customerInformation.companyName[0].toUpperCase() + this.customerInformation.id
      }, () => alert("api is down"));
  }

  //get customer invoices
  getCustomerInvoices() {
    this.invoicesService.getCustomerInvoices(this.id,this.query)
      .subscribe((data: any) => {

        this.customerInvoices = data.data;
        this.totalRecords = data.totalRecords;

        let invoiceDate: any;

        this.customerInvoices.forEach((invoice: any) => {
          invoiceDate = new Date(invoice.invoiceDate);
          invoice.invoiceDate = invoiceDate.toLocaleDateString();
          invoice.id = this.formatInvoiceNumber(invoice.id);
        });

        this.dataSource = this.customerInvoices;
      }, () => {alert("api is down")})
  }

  formatInvoiceNumber(invNumber: number) {
    return this.invoicesService.formatInvoiceNumber(invNumber);
  }

  createCustomerInvoice() {

    let newInvoiceObject: any = {
      invoiceDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      customerID: this.id,
      paid: false,
      gst: false
    }

    this.invoiceService.createCustomerInvoice(newInvoiceObject)
      .then((data) => {

        let responseObject:any = data

        let invoiceID: any = responseObject.data.id

        let message:string = responseObject.message

        this.router.navigate([`/invoice/${invoiceID}`])

        this._snackBar.open(message,"Dismiss")

      }, () => { alert("api is down") }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.query.Search = filterValue;
    this.searchFilter = filterValue;
  }

  handlePageEvent(event: PageEvent) {
    this.totalRecords = event.length;
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;

    this.query.PageNumber = this.pageNumber + 1;
    this.query.PageSize = this.pageSize;
    this.query.Search = this.searchFilter;

    this.getCustomerInvoices();

  }

  sortColumn(columnHeader: any) {
    if (columnHeader.classList.contains("hover") ) {

      this.toggleService.removeDisplayedArrows();
      delete this.query.AscDesc;
      delete this.query.Sort;

    };

    if (!this.query.hasOwnProperty('AscDesc') && !this.query.hasOwnProperty('Sort')) {

      this.query.AscDesc = true;
      this.query.Sort = columnHeader.id;

      this.toggleService.toggleSort(columnHeader,"up")

    } else if (this.query.AscDesc === true) {

      this.query.AscDesc = false;
      this.query.Sort = columnHeader.id;

      this.toggleService.toggleSort(columnHeader,"down");

    } else {

      delete this.query.AscDesc;
      delete this.query.Sort;

      this.toggleService.toggleSort(columnHeader);
    }

    this.getCustomerInvoices();


  }

}
