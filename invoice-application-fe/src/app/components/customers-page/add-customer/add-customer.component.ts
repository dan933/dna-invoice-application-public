import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
import { UntypedFormBuilder, Validators } from '@angular/forms';
// import { MatLegacyFormFieldControl as MatFormFieldControl, MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

import { Customer } from 'src/app/models/customers-model';
import { CustomersPageComponent } from 'src/app/components/customers-page/customers-page.component'
import { CustomersService } from 'src/app/services/customers.service';
import { PopUpService } from 'src/app/services/pop-up.service';
// import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  addCustomerForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    companyName: [''],
    emailAddress:['',[Validators.required, Validators.email]]
  })

  constructor(
    private fb: UntypedFormBuilder,
    public customersService: CustomersService,
    // private _snackBar: MatSnackBar,
    private _popUpService:PopUpService,
    private _customersPage:CustomersPageComponent
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    var customerOutput: Customer[] = [];
    var customer: Customer;
    var response: any;

    if (this.addCustomerForm.valid)
    {
      customer = this.addCustomerForm.value;
      console.log(customer);
      customer.firstName = customer.firstName[0].toUpperCase() + customer.firstName.slice(1);
      customer.lastName = customer.lastName[0].toUpperCase() + customer.lastName.slice(1);
      customer.emailAddress = customer.emailAddress.toLowerCase();
      customer.active = true;
      customerOutput.push(customer);

      this.customersService.addCustomer(customerOutput)
        .subscribe((data) => {
          this.addCustomerForm.reset();

          Object.keys(this.addCustomerForm.controls).forEach(key =>{
            this.addCustomerForm.controls[key].setErrors(null)
          });

          this._popUpService.hidePopups();
          response = data;
          response = response.message;
          // this._snackBar.open(response, "Dismiss");
          this._customersPage.ngOnInit();
        });

    }

  }

}
