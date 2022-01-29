import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Customer } from '../models/customers-model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  invoicesUrl: string = environment.apiUrl + 'Invoices';

  constructor(public http: HttpClient) { }

  getCustomerInvoices(id:number, query:any) {
    return this.http.get(`${this.invoicesUrl}/customer/${id}`,{params:query})
  }

  getInvoice(id: number) {
    return this.http.get(`${this.invoicesUrl}/get-invoice-details/${id}`)
  }

  getInvoiceHeader(id: number) {
    return this.http.get(`${this.invoicesUrl}/invoice/${id}`)
  }

  editInvoiceHeader(invoiceObject: any) {
    return this.http.put(`${this.invoicesUrl}/edit-invoice`,invoiceObject)
  }

  deleteInvoice(invoiceId: number[]) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: invoiceId
    };

    return this.http.delete(`${this.invoicesUrl}/delete-invoice`, options);
  }

  async createCustomerInvoice(invoiceObject: any) {
    return this.http.post(`${this.invoicesUrl}/create-invoice`, invoiceObject).toPromise();
  }

  addInvoiceDetail(invoiceDetailList: any[]) {
    return this.http.post(`${this.invoicesUrl}/createInvoiceDetails`, invoiceDetailList)

  }

  editInvoiceDetail(invoiceDetailList: any[]) {
    return this.http.put(`${this.invoicesUrl}/edit-invoice-details`,invoiceDetailList)
  }

  deleteInvoiceDetails(invoiceDetailsIDList: number[]) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: invoiceDetailsIDList
    };

    return this.http.delete(`${this.invoicesUrl}/delete-invoice-details`, options);
  }

  formatInvoiceNumber(invoiceID: number) {
    let invoiceNumber = invoiceID.toString()
    let digitQuantity = invoiceNumber.length;
    let numberOfZeros = 4 - digitQuantity;
    numberOfZeros = numberOfZeros > 0 ? numberOfZeros : 0;

    invoiceNumber = "0".repeat(numberOfZeros) + invoiceNumber;

    return invoiceNumber;
  }

}
