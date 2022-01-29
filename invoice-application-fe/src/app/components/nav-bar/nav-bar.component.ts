import { Component, ElementRef, OnInit } from '@angular/core';
import { PopUpService } from 'src/app/services/pop-up.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public isMobileLayout: boolean = false;
  public subMenuToggle: boolean = false;

  constructor(
    public popUpService: PopUpService
  ) { }

  ngOnInit(): void {
  }


  showCompactNav() {
    //display nav content
    var subMenu:CSSStyleDeclaration|null = document.getElementById('menu-list-container')!.style;
    subMenu.display = "block";

    //source: https://www.w3schools.com/js/js_htmldom_animate.asp
    //change width animation
    let id:any = null;
    let width = 0;

    id = setInterval(frame, 4);

    function frame() {
      let background: CSSStyleDeclaration | null = document.getElementById('gray-background')!.style;

      if (width == 70) {

        //show background for compact nav-bar
        background.opacity = '0.9';
        background.display = 'block';

        //stop incrementing width of compact-nav-bar
        clearInterval(id);

      } else {
        //increment width of compact-nav-bar
        width += 2;
        subMenu!.width = width + "vw";
      }
    }
  }

  hidePopups() {
    this.popUpService.hidePopups();
  }
}
