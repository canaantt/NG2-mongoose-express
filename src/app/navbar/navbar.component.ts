import { Component, OnInit, ViewChild} from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { StateService } from '../service/state.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  // @ViewChild(LoginComponent) loginComponent: LoginComponent;

 authenticated = false;
 user: any;

  constructor(private stateService: StateService) {
    this.stateService.authenticated
        .subscribe(res => {
          this.authenticated = res;
          console.log('in Nav constructor');
          console.log(this.authenticated);
        });
    this.stateService.user
        .subscribe(res => {
          this.user = res;
        });
  }

  

 }


