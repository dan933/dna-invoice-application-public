import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceComponent } from './components/invoice/invoice.component';
import { CustomersPageComponent } from './components/customers-page/customers-page.component';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';

const routes: Routes = [
  { path: 'customers', component: CustomersPageComponent },
  { path: 'customer/:id', component: CustomerPageComponent },
  { path: 'invoice/:id', component: InvoiceComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
