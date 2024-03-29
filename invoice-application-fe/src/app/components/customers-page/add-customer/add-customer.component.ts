import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
import { UntypedFormBuilder, Validators } from '@angular/forms';
// import { MatLegacyFormFieldControl as MatFormFieldControl, MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

import { Customer } from 'src/app/models/customers-model';
import { CustomersService } from 'src/app/services/customers.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';



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
    public dialogRef: MatDialogRef<AddCustomerComponent>,
    private _snackBar: MatSnackBar
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
          
          response = data;
          response = response.message;
          this._snackBar.open(response, "Dismiss");
          this.dialogRef.close({});
        });

    }

  }

}
