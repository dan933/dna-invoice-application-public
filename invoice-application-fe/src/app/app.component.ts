import { Component, OnInit } from '@angular/core';
import { ToggleNavService } from './services/toggle-nav.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  sideNavToggleStatus:boolean = false;

  title = 'invoice-application-fe';

  constructor(
    public toggleNavService:ToggleNavService
  ) {

  }

  ngOnInit(): void {
    this.toggleNavService.navToggledata.subscribe(resp => {
      this.sideNavToggleStatus = resp;
    });
  }


  sideNavToggleChange(toggleStatus:boolean){
    if(this.sideNavToggleStatus != toggleStatus){
      this.toggleNavService.toggleNav(toggleStatus);
    }
  }
}
