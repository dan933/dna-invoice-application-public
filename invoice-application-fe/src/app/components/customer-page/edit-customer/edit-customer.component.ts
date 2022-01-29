import { Component, Input, AfterViewInit, OnInit, OnChanges, AfterContentChecked, AfterContentInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/services/customers.service';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CustomerPageComponent } from '../customer-page.component';


import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit  {

  constructor(
    private fb: FormBuilder,
    public customerService: CustomersService,
    public navServices:NavBarComponent,
    private _snackBar: MatSnackBar,
    public customerPageService:CustomerPageComponent
  ) { }

  @Input() editCustomerInformation!: any;

  firstName:string = ""

  editCustomerFromGroup: FormGroup = this.fb.group({
      firstName: this.fb.control(""),
      lastName: this.fb.control(""),
      companyName: this.fb.control(""),
      emailAddress:this.fb.control(""),
      active:this.fb.control("")
  });


  ngOnInit(): void {
    setTimeout(() => {
      this.editCustomerFromGroup = this.fb.group({
        firstName: this.fb.control(this.editCustomerInformation.firstName,[Validators.required,Validators.minLength(1)]),
        lastName: this.fb.control(this.editCustomerInformation.lastName,[Validators.required,Validators.minLength(1)]),
        companyName: this.fb.control(this.editCustomerInformation.companyName,[Validators.required,Validators.minLength(1)]),
        emailAddress:this.fb.control(this.editCustomerInformation.emailAddress,[Validators.required,Validators.email]),
        active:this.fb.control(this.editCustomerInformation.active)
      })
    })
  }

  editCustomer() {
    let customer;

    if (this.editCustomerFromGroup.valid) {
      customer = this.editCustomerFromGroup.value;
      customer.id = this.editCustomerInformation.id;

      // todo add phone number to FE
      customer.phoneNumber = "111";

      this.customerService.editCustomer(customer)
        .subscribe((data) => {
          let responseObject: any = data

          let isSuccess: boolean = responseObject.success;

          console.log(isSuccess);

          this.navServices.hidePopups();

          console.log(responseObject);

          let message: string = responseObject.message;

          isSuccess == true ? this._snackBar.open(message, "Dismiss") : null

          this.customerPageService.getCustomerDetails();

        }, (error) => {
          console.log(error)
          this.navServices.hidePopups();
          this._snackBar.open(error.message,"Dismiss")
        });
    }
  }

}
