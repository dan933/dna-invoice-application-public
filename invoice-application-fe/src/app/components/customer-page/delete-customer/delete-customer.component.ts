import { Component, OnInit } from '@angular/core';
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

  id:string = ""

  constructor(
    public customerService: CustomersService,
    private route: ActivatedRoute,
    private router: Router,
    public navBarServices: NavBarComponent,
    // private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  onCancel() {
    let deleteCustomerForm: CSSStyleDeclaration = document.getElementById('deleteCustomer')!.style;
    //hide delete customer form
    deleteCustomerForm != null ? deleteCustomerForm.display = 'none' : null;

    this.navBarServices.hidePopups();
  }

  deleteCustomer() {
    this.customerService.deleteCustomer([parseInt(this.id)])
      .subscribe((data) => {

        let responseObject: any = data;
        let isSuccess: boolean = responseObject.success;
        let message: string = responseObject.message;

        this.navBarServices.hidePopups();

        this.router.navigate([`/customers`])

        // isSuccess == true ? this._snackBar.open(message,"Dismiss") : null
      }, (error) => {
        this.navBarServices.hidePopups();
        // this._snackBar.open(error.message, "Dismiss");
      });




  }

}
