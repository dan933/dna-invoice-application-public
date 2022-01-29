import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  showGrayBackground() {
    let background: CSSStyleDeclaration | null = document.getElementById('gray-background')!.style;

     //show background
     background.opacity = '0.9';
     background.display = 'block';
  }

  hidePopups() {
    let subMenu: CSSStyleDeclaration | null = document.getElementById('menu-list-container')!.style;
    let background: CSSStyleDeclaration | null = document.getElementById('gray-background')!.style;
    let NewCustomerForm: CSSStyleDeclaration | undefined = document.getElementById('addCustomerForm')?.style;
    let editCustomerFrom: CSSStyleDeclaration | undefined = document.getElementById('editCustomerForm')?.style;
    let deleteCustomerForm: CSSStyleDeclaration | undefined = document.getElementById('deleteCustomer')?.style;
    let deleteInvoiceForm: CSSStyleDeclaration | undefined = document.getElementById('deleteInvoice')?.style;

    //hide contents of compact-nav-bar
    subMenu.display = 'none';
    subMenu.width = '0vw';
    background.opacity = '0';
    background.display = 'none';

    //hide contents of new customerForm
    NewCustomerForm != null ? NewCustomerForm.display = 'none' : null;

    //hide contents of edit customer form
    editCustomerFrom != null ? editCustomerFrom.display = 'none' : null;

    //hide delete customer form
    deleteCustomerForm != null ? deleteCustomerForm.display = 'none' : null;

    //hide delete invoice form
    deleteInvoiceForm != null ? deleteInvoiceForm.display = 'none' : null;
  }
}
