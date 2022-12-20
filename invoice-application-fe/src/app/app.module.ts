import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './modules/materials-module';

import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CustomersPageComponent } from './components/customers-page/customers-page.component';
import { AddCustomerComponent } from './components/customers-page/add-customer/add-customer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { EditCustomerComponent } from './components/customer-page/edit-customer/edit-customer.component';
import { DeleteCustomerComponent } from './components/customer-page/delete-customer/delete-customer.component';
import { DeleteInvoiceComponent } from './components/invoice/delete-invoice/delete-invoice.component';
import { MatDialogRef } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CustomersPageComponent,
    AddCustomerComponent,
    CustomerPageComponent,
    InvoiceComponent,
    EditCustomerComponent,
    DeleteCustomerComponent,
    DeleteInvoiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    NavBarComponent,
    CustomersPageComponent,
    CustomerPageComponent,
    {provide: MatDialogRef, useValue:{}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
