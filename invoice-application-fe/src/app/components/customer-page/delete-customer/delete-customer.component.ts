import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from 'src/app/services/customers.service';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

// import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.scss']
})
export class DeleteCustomerComponent implements OnInit {

  id!:number

  constructor(
    public customerService: CustomersService,
    private route: ActivatedRoute,
    private router: Router,
    public navBarServices: NavBarComponent,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DeleteCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { 
    this.id = +this.data.customerId
  }

  ngOnInit(): void {
  }

  onCancel() {
    let deleteCustomerForm: CSSStyleDeclaration = document.getElementById('deleteCustomer')!.style;
    //hide delete customer form
    deleteCustomerForm != null ? deleteCustomerForm.display = 'none' : null;
    
    this.dialogRef.close();
  }

  deleteCustomer() {
    this.customerService.deleteCustomer([this.id])
      .subscribe((data) => {

        let responseObject: any = data;
        let isSuccess: boolean = responseObject.success;
        let message: string = responseObject.message;

        this.dialogRef.close();
        this.router.navigate([`/customers`])

        isSuccess == true ? this._snackBar.open(message,"Dismiss") : null
      }, (error) => {
        this.dialogRef.close();
        this._snackBar.open(error.message, "Dismiss");
      });




  }

}
