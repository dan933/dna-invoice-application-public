import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ToggleNavService } from 'src/app/services/toggle-nav.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {

  public screenWidth: any;
  IsCompactNav!:boolean;

  toggleStatus:boolean = false;



  constructor(
    public toggleNavService:ToggleNavService
  ) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.IsCompactNav = this.screenWidth > 393 ? false : true;

    this.toggleNavService.navToggledata.subscribe((resp) => {
      this.toggleStatus = resp;
      console.log(this.toggleStatus)
    });
  }

  toggleSideNav(){
    this.toggleStatus = !this.toggleStatus;
    this.toggleNavService.toggleNav(this.toggleStatus);
  }


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    this.IsCompactNav = this.screenWidth > 393 ? false : true;

  }



}
