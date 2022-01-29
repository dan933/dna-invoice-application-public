import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CustomersService } from 'src/app/services/customers.service';
import { ToggleSortService } from 'src/app/services/toggle-sort.service';

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss']
})
export class CustomersPageComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'companyName', 'emailAddress', 'active'];

  customers: any = [];
  dataSource = [];

  showInactive = false;



  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  totalRecords = 0;
  pageNumber = 0;
  searchFilter = "";

  query:any = {
    isActive: !this.showInactive,
    PageNumber: this.pageNumber + 1,
    PageSize: this.pageSize,
    Search: ""
  }



  constructor(
    public customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
    public toggleService:ToggleSortService
  ) {
  }

  ngOnInit(): void {

    let checkParams = this.toggleService.checkParams;

    this.route.queryParams.subscribe(params => {
      checkParams(params.page) ? this.query.PageNumber = parseInt(params.page) + 1 : null;
       checkParams(params.page) ? this.pageNumber = parseInt(params.page) : null;

       checkParams(params.pageSize)  ? this.query.PageSize = parseInt(params.pageSize) : null;
       checkParams(params.pageSize) ? this.pageSize = parseInt(params.pageSize) : null;

       checkParams(params.sort) ? this.query.Sort = params.sort : null;
       checkParams(params.order) ? this.query.AscDesc = (/true/i).test(params.order) : null;

      this.searchCustomers(params);

    }).unsubscribe();

  }

  showNewCustomerForm() {
    let form = document.getElementById('addCustomerForm');
    form!.style.display = 'block';

    let background: CSSStyleDeclaration | null = document.getElementById('gray-background')!.style;
    background.opacity = '0.9';
    background.display = 'block';

  }

  toggleShowInactive() {
    this.showInactive = !this.showInactive;
    this.searchCustomers();
  }

  //navigate to specific customer page
  navCustomer(id: any) {
    this.router.navigate([`/customer/${id}`])
  }

  handlePageEvent(event: PageEvent) {

    this.totalRecords = event.length;
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;

    this.query.isActive = !this.showInactive;
    this.query.PageNumber = this.pageNumber + 1;
    this.query.PageSize = this.pageSize;
    this.query.Search = this.searchFilter;


    this.customersService.getCustomers(this.query)
      .subscribe((data: any) => {
        this.customers = data.data;
        this.totalRecords = data.totalRecords;
        this.dataSource = this.customers;
      }, () => { alert("api is down") });

    this.router.navigate(
      ['customers'],
      { queryParams: { page: this.pageNumber, pageSize:this.pageSize, sort:this.query.Sort, order:this.query.AscDesc } }
    )
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.query.Search = filterValue;
    this.searchFilter = filterValue;
  }

  searchCustomers(params?: Params) {

    this.query.isActive = !this.showInactive;

    this.customersService.getCustomers(this.query)
    .subscribe((data: any) => {
      this.customers = data.data;
      this.totalRecords = data.totalRecords;
      this.dataSource = this.customers;

      if (params?.order != undefined && params.sort != undefined) {
        this.toggleService.showArrowSorted(params.sort, params.order);
      }

    }, () => { alert("api is down") });

  }

  sortColumn(columnHeader: any) {

    if (columnHeader.classList.contains("hover") ) {

      this.toggleService.removeDisplayedArrows();
      delete this.query.AscDesc;
      delete this.query.Sort;

    };

    if (!this.query.hasOwnProperty('AscDesc') && !this.query.hasOwnProperty('Sort')) {

      this.query.AscDesc = true;
      this.query.Sort = columnHeader.id;

      this.toggleService.toggleSort(columnHeader,"up")

    } else if (this.query.AscDesc === true) {

      this.query.AscDesc = false;
      this.query.Sort = columnHeader.id;

      this.toggleService.toggleSort(columnHeader,"down");

    } else {

      delete this.query.AscDesc;
      delete this.query.Sort;

      this.toggleService.toggleSort(columnHeader);
    }

    this.searchCustomers();

    this.router.navigate(
      ['customers'],
      { queryParams: { page: this.pageNumber, pageSize:this.pageSize, sort:this.query.Sort, order:this.query.AscDesc } }
    )




  }

}
