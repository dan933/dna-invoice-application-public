import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Customer, EditCustomer } from '../models/customers-model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  customersUrl: string = environment.apiUrl + 'Customers';

  constructor(public http: HttpClient) { }

  getCustomers(query:any) {

    return this.http.get(this.customersUrl,{params:query});
  }

  getCustomer(id:number) {
    return this.http.get(`${this.customersUrl}/${id}`)
  }

  addCustomer(customers: Customer[]) {

    const httpOptions = {
      headers: new HttpHeaders({
        accept: 'text/plain',
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(this.customersUrl, customers)
  }

  deleteCustomer(customerList: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: customerList
    };

    return this.http.delete(`${this.customersUrl}`, options);
  }

  editCustomer(customer: EditCustomer) {
    let customerObject: EditCustomer[] = [];
    customerObject.push(customer);

    return this.http.put(this.customersUrl, customerObject);
  }
}
