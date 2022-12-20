import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleNavService {

  constructor() { }

  private navToggledataSource = new BehaviorSubject<boolean>(false);

  navToggledata = this.navToggledataSource.asObservable();

  toggleNav(toggle:boolean){
    this.navToggledataSource.next(toggle);
  }
}
