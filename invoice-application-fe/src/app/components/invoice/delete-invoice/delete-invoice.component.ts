import { Component, Inject, Input, OnInit } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { CustomerPageComponent } from 'src/app/components/customer-page/customer-page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-invoice',
  templateUrl: './delete-invoice.component.html',
  styleUrls: ['./delete-invoice.component.scss']
})
export class DeleteInvoiceComponent implements OnInit {

  id: number[] = [];

  customerId: any;

  constructor(
    private invoicesService: InvoicesService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public _customerPage:CustomerPageComponent,
    public dialogRef: MatDialogRef<DeleteInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { 

    this.customerId = data.customerId;
    this.id.push(data.invoiceId);

  }



  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDeleteInvoice() {
    var response:any;

    this.invoicesService.deleteInvoice(this.id)
      .subscribe((data) => {

        response = data;
        response = response.message;

        this.router.navigate([`/customer/${this.customerId}`])

        this._snackBar.open(response);
        this.dialogRef.close();

      }, (error) => {
        this._snackBar.open(error.message);
        this.dialogRef.close();
    })
  }

}
