import { Component, OnInit, ViewChild} from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{
   @ViewChild(LoginComponent) loginComponent: LoginComponent;
//  status: any = {
//           'authenticated': false,
//           'user': null
//         }
 authenticated = false;
 user:any;
 
  constructor() {}
  ngOnInit() {
    console.log(this.authenticated);
  }

  authCB() {
    console.log('in authentiation call back function');
    this.loginComponent.monitor();
  }
  pLoginAction (event) {
    console.log(event);
    this.authenticated = event;
    this.authCB();
  }
  getUserInfo (event) {
    console.log(event);
    this.user = event;
  }
}


