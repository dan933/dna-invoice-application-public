import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
// import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices.service';
import { DateAdapter } from '@angular/material/core';
import { UntypedFormBuilder } from '@angular/forms';
import { CurrencyPipe, formatCurrency, formatDate } from '@angular/common';
import { CustomersService } from 'src/app/services/customers.service';
import { PopUpService } from 'src/app/services/pop-up.service';
// import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



export interface InvoiceDetails {
  id: number|null;
  invoiceID: number;
  details: string;
  qty: number;
  price: number;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  id: string = "";
  dataSource:any[] = [];
  invoiceDetailsList:any;
  displayedColumns: string[] = ["details", "price", "qty", "sub-total", "bin"];

  isGST: string = "No";
  gstOptions: string[] = ["Yes", "No"];

  isPaid: string = "No";
  paidOptions: String[] = ["Yes", "No"];

  invoiceNumber: string = "";

  customerId!:string;

  customer?: any = {
    firstName: "",
    lastName: "",
    companyName: "",
    emailAddress:""
  };

  invoiceDate: Date = new Date();


  invoiceCalculation: any = {};



  // @ViewChild(MatTable)
  // table!: MatTable<InvoiceDetails>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public invoicesService: InvoicesService,
    public customerService: CustomersService,
    private dateAdapter: DateAdapter<Date>,
    public fb: UntypedFormBuilder,
    public popUpService: PopUpService,
    // private _matSnackBar:MatSnackBar,
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    this.invoicesService.getInvoiceHeader(parseInt(this.id))
      .subscribe(
        (data) => {
          let invoiceHeaderObject: any = data;
          this.invoiceNumber = this.invoicesService.formatInvoiceNumber(invoiceHeaderObject.data.id);
          this.invoiceDate = new Date(invoiceHeaderObject.data.invoiceDate);
          this.customerId = invoiceHeaderObject.data.customerID;
          this.isGST = invoiceHeaderObject.data.gst == true ? "Yes" : "No";
          this.isPaid = invoiceHeaderObject.data.paid == true ? "Yes" : "No";

          this.toggleGSTColor(this.isGST == "Yes" ? true: false);

          this.customerService.getCustomer(parseInt(this.customerId))
          .subscribe(
            (data) => {
              this.customer = data;
              this.customer = this.customer.data;
            }
          )
      }, (error) => { alert('something went wrong with the API')}
    )

    this.invoicesService.getInvoice(parseInt(this.id))
      .subscribe(
        data => {
          this.getInvoiceDetails(data);
        });

  }

  getInvoiceDetails(data: any) {
    console.log(data)
    this.invoiceDetailsList = data;
    this.dataSource = this.invoiceDetailsList.invoiceDetails;
    this.invoiceCalculation = this.calculateTotal();
  }

  addItem() {

    this.dataSource.push({
      invoiceID: parseInt(this.id),
      details: "",
      qty: 0,
      price: 0
    });

    // this.table.renderRows();
  }

  removeItem(item: any) {
    let itemArray: number[] = [];
    itemArray.push(item.id);

    this.invoicesService.deleteInvoiceDetails(itemArray)
      .subscribe((data) => {
        console.log(data);
      });

    this.dataSource = this.dataSource.filter(obj => obj !== item);

    // this.table.renderRows();
  }

  save() {

    let itemDetailsList:NodeListOf<HTMLInputElement> = document.querySelectorAll!('input.item-details');

    let itemPriceList:NodeListOf<HTMLInputElement> = document.querySelectorAll!('input.item-price');

    let itemQtyList: NodeListOf<HTMLInputElement> = document.querySelectorAll!('input.item-qty');

    this.dataSource.forEach((data, index) => {
      data.details = itemDetailsList[index].value;
      data.qty = parseInt(itemQtyList[index].value);
      data.price = parseFloat(itemPriceList[index].value);
    });

    let newItems = this.dataSource.filter(item => item.id == null);

    let existingItems = this.dataSource.filter(item => item.id != null);

    newItems.length > 0 ? this.invoicesService.addInvoiceDetail(newItems)
      .subscribe(
        data => {

          let apiData: any = data;
          let invoiceDatailsArray: any[] = apiData.invoiceDetails;

          newItems.forEach((item, index) => { item.id = invoiceDatailsArray[index].id, console.log(item) });

          // this._matSnackBar.open(apiData.message, "Dismiss");
        }, (error) => {
          // this._matSnackBar.open(error.message, "Dismiss");
        }) : null;

    existingItems.length > 0 ? this.invoicesService.editInvoiceDetail(existingItems)
      .subscribe(data => {
        let apiData: any = data;
        // this._matSnackBar.open(apiData.message, "Dismiss");

      },
      (error) => {
        // this._matSnackBar.open(error.message, "Dismiss");
      }) : null;


    let invoiceHeaderObject = {
      id:parseInt(this.id),
      invoiceDate: formatDate(this.invoiceDate.toISOString(), "YYYY-MM-dd", "en-AU"),
      customerID: parseInt(this.customerId),
      paid: this.isPaid == "Yes"? true : false,
      gst:this.isGST == "Yes"? true : false
    }

    this.invoicesService.editInvoiceHeader(invoiceHeaderObject)
      .subscribe((data:any) => {
        console.log(data);
        let gst = data.data.gst;

        this.toggleGSTColor(gst);

      })

      this.invoiceCalculation = this.calculateTotal();
  }

  showDeleteInvoiceForm() {

    this.popUpService.showGrayBackground();

    let deleteFrom: CSSStyleDeclaration = document.getElementById('deleteInvoice')!.style;
    deleteFrom.display = 'block';
  }

  calculateTotal() {

    let sum: number = 0;
    let qty: number = 0;
    let gst: number | string = "N/A";
    let total: number = 0;

    this.dataSource.forEach((item) => {
      sum += item.qty * item.price;
      qty += item.qty;
    })

    if (this.isGST == "Yes") {
      gst = sum * 0.1;
      total += gst;
    }

    total += sum;

    let calculationOutput = {
      qty: qty,
      subtotal: formatCurrency(sum,'en-AU','$'),
      gst: typeof(gst) == "string" ? gst : formatCurrency(gst,'en-AU','$'),
      total: formatCurrency(total,'en-AU','$')
    };
    return calculationOutput;
  }

  toggleGSTColor(gst: boolean) {
    !gst ? document.getElementById('gst-amount')!.style.color = 'red' : document.getElementById('gst-amount')!.style.color = 'black';
  }

  downloadPDF() {

    console.log(this.invoiceNumber)

    let dataBody: any[] = this.createTableRows();

    let totalsObject: any = this.calculateTotal();

    let pdf:any = this.makePDF(dataBody,totalsObject)

    pdf.save(`INV${this.invoiceNumber}.pdf`)

  }

  createTableRows() {

    let dataBody: string[][] = []

    let invoiceDetailArray: string[] = []

    let gst: number;
    let totalIncGST: number;

    this.dataSource.forEach((item) => {

      if (this.isGST == "No") {
        invoiceDetailArray = [`${item.details}`, `${item.qty}`, formatCurrency(item.price, 'en-AU', '$'), 'N/A', formatCurrency(item.qty * item.price, 'en-AU', '$')];

        dataBody.push(invoiceDetailArray);

      } else {

        gst = (item.qty * item.price) * 0.1;
        totalIncGST = (item.qty * item.price) * 1.1;

        invoiceDetailArray = [`${item.details}`, `${item.qty}`, formatCurrency(item.price,'en-AU','$'), formatCurrency(gst,'en-AU','$'), formatCurrency(totalIncGST,'en-AU','$')]

        dataBody.push(invoiceDetailArray);
      }

    })

    return dataBody;
  }

  makePDF(dataBody: string[][], totalsObject: any) {

    const pdf = new jsPDF('p', 'mm', 'a4')

    var img = new Image()
    img.src = '../../../../assets/img/da-logo.png';

    pdf.addImage(img, 'png', 10, 10, 50, 30);

    pdf.setTextColor(0, 0, 255);
    pdf.setFontSize(30)
    this.isGST != "Yes" ? pdf.text("Invoice", 150, 30) : pdf.text("Tax Invoice", 150, 30);

    pdf.setFontSize(20)

    pdf.text(`ABN: 11 111 111`, 15, 50);

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(13);

    pdf.text(`
    M: 041111111
    E: example@gmail.com

    To:
    ${this.customer.firstName} ${this.customer.lastName}
    ${this.customer.companyName}
    ${this.customer.emailAddress}
    `, 10, 55, {
      lineHeightFactor:1.3
    });

    pdf.text(`
      Invoice No: INV${this.invoiceNumber}
      Date: ${formatDate(this.invoiceDate, 'dd/MM/yyyy', 'en')}
      Customer Code: ${this.customer.companyName[0]+this.customerId}
      `, 140, 55, {
      lineHeightFactor:1.2
      }
    )


    let bottomOfInvoiceTable: any;

    autoTable(pdf,{
      head: [['Description', 'Quantity', 'Price','GST','Total']],
      body: dataBody,
      foot: [['Total:','',totalsObject.subtotal,totalsObject.gst,totalsObject.total]],
      footStyles: {
        fontStyle: "bold"
      },
      showFoot:"lastPage",
      startY: 105,
      styles: {
        halign:"right",
        minCellWidth: 30
      },

      headStyles: {
        fontStyle: "bold"
      },

      columnStyles: {
        0:{halign:'left'}
      },

      didDrawCell: (data: any) => {
        bottomOfInvoiceTable = data.table;
      }
    })

    let footerHeight = bottomOfInvoiceTable.finalY + 5;

    pdf.setFontSize(13)

    if (footerHeight >= pdf.internal.pageSize.getHeight() - 30) {

      pdf.addPage();

      pdf.text(
        `
        BSB: 111-111
        Account Number: 111-111
        Account Name: Company
        `, 7, 5, {
            align: "left",
          lineHeightFactor:1.5
      });

      if (this.isGST == "No") {
        pdf.setTextColor("red");
        pdf.text(
        `
        Not Registered for GST
        `,7, 30)

      }

    } else {

      pdf.text(
      `
      BSB: 111-111
      Account Number: 111-111
      Account Name: Company
      `, 7, footerHeight, {
          align: "left",
        lineHeightFactor:1.5

      });

      if (this.isGST == "No") {
        pdf.setTextColor("red");
        pdf.text(
      `
      Not Registered for GST
      `
        , 7, footerHeight + 23,
          {
            align: "left",
            lineHeightFactor:1.5
        })
      }
    }

    return pdf;

  }

}
