import { Component, OnInit, ViewChild} from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  // @ViewChild('login') LoginComponent;
//  status: any = {
//           'authenticated': false,
//           'user': null
//         }
 authenticated = false;

  constructor() {}

  pLoginAction (event) {
    console.log(event);
    this.authenticated = event;
    console.log(this.authenticated);
  }
}


