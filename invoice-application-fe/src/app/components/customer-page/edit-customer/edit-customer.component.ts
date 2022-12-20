import { Component, Input, OnInit  } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomersService } from 'src/app/services/customers.service';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CustomerPageComponent } from '../customer-page.component';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit  {

  @Input() editCustomerInformation!: any;

  constructor(
    private fb: UntypedFormBuilder,
    public customerService: CustomersService,
    public navServices:NavBarComponent,
    private _snackBar: MatSnackBar,
    public customerPageService:CustomerPageComponent
  ) { 

  } 

  firstName:string = ""

  editCustomerFromGroup:FormGroup = this.fb.group({
    firstName: ["",[Validators.required,Validators.minLength(1)]],
        lastName: ["",[Validators.required,Validators.minLength(1)]],
        companyName: ["",[Validators.required,Validators.minLength(1)]],
        emailAddress:["",[Validators.required,Validators.email]],
        active:[true]
  });


  ngOnInit(): void {    
      this.editCustomerFromGroup = this.fb.group({
        firstName: [this.editCustomerInformation.firstName,[Validators.required,Validators.minLength(1)]],
        lastName: [this.editCustomerInformation.lastName,[Validators.required,Validators.minLength(1)]],
        companyName: [this.editCustomerInformation.companyName,[Validators.required,Validators.minLength(1)]],
        emailAddress:[this.editCustomerInformation.emailAddress,[Validators.required,Validators.email]],
        active:[this.editCustomerInformation.active]
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

          this.navServices.hidePopups();

          let message: string = responseObject.message;

          isSuccess == true ? this._snackBar.open(message, "Dismiss") : null

          this.customerPageService.getCustomerDetails();

        }, (error) => {
          this.navServices.hidePopups();
          this._snackBar.open(error.message,"Dismiss")
        });
    }
  }

}
