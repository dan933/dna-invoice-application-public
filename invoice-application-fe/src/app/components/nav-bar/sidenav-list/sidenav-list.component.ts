import { Component, ViewEncapsulation } from '@angular/core';
import { ToggleNavService } from 'src/app/services/toggle-nav.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavListComponent {

  constructor(
    public toggleNavService:ToggleNavService
  ){

  }

  toggleSideNav(){

    this.toggleNavService.toggleNav(false)

  }
}
