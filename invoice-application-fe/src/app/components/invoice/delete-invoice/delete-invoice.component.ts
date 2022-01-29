import { Component, Input, OnInit } from '@angular/core';
import { PopUpService } from 'src/app/services/pop-up.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerPageComponent } from 'src/app/components/customer-page/customer-page.component';


@Component({
  selector: 'app-delete-invoice',
  templateUrl: './delete-invoice.component.html',
  styleUrls: ['./delete-invoice.component.scss']
})
export class DeleteInvoiceComponent implements OnInit {

  constructor(
    private _popUpService: PopUpService,
    private invoicesService: InvoicesService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public _customerPage:CustomerPageComponent
  ) { }

  id: number[] = [];

  @Input() customerId: any;

  ngOnInit(): void {
    this.id.push(parseInt(this.route.snapshot.paramMap.get('id')!));
  }

  onCancel() {
    this._popUpService.hidePopups();
  }

  onDeleteInvoice() {
    var response:any;

    this.invoicesService.deleteInvoice(this.id)
      .subscribe((data) => {

        this._popUpService.hidePopups();
        response = data;
        response = response.message;

        this.router.navigate([`/customer/${this.customerId}`])

        this._snackBar.open(response, "Dismiss");

      }, (error) => {
        this._popUpService.hidePopups();
        this._snackBar.open(error.message, "Dismiss");
    })
  }

}
