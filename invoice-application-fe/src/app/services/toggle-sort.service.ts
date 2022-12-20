import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToggleSortService {

  constructor() { }

  toggleSort(columnHeader: HTMLStyleElement, direction?: string) {

    let sortArrow: HTMLStyleElement = <HTMLStyleElement>columnHeader.firstElementChild;

    if (direction?.toUpperCase() === "UP") {

      columnHeader.classList.remove("hover");
      sortArrow!.style.transform = "rotate(180deg)";
      sortArrow!.style.color = "blue";


    } else if (direction?.toUpperCase() === "DOWN") {

      columnHeader.classList.remove("hover");
      sortArrow!.style.transform = "rotate(360deg)";
      sortArrow!.style.color = "blue";


    } else {

      columnHeader.classList.add("hover");
      sortArrow!.style.transform = "rotate(180deg)";
      sortArrow!.style.color = "transparent";

      setTimeout(() => {
        sortArrow!.removeAttribute("style");
      }, 1000);

    }



  }

  removeDisplayedArrows() {

    let columnHeader: NodeListOf<HTMLStyleElement> = document.querySelectorAll('.mat-icon');

    columnHeader.forEach((item) => {
      item.removeAttribute("style");
      item.parentElement?.classList.add("hover");
    })


  }

  showArrowSorted(sortColumn: string, ascDesc: string) {
    let columnHeaders:NodeListOf<HTMLStyleElement> = document.querySelectorAll('th.sort-header');
    columnHeaders.forEach((item) => {
      if (item.id == sortColumn) {
        item.classList.remove("hover");

        ascDesc == "true" ? this.toggleSort(item, "up") : this.toggleSort(item, "down") ;
      }
    })

  }

  checkParams(param: Params):boolean {
    let isParam = param != undefined ? true : false;

    return isParam;
  }

}
