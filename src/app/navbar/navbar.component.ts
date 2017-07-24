import { Component, OnInit, ViewChild} from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  authenticated = false;
  user: any;

  constructor( private stateService: StateService,
               private userService: UserService,
               private router: Router) {
    this.stateService.user
        .subscribe(res => {
          this.user = res;
        });
    this.stateService.authenticated
        .subscribe(res => {
          this.authenticated = res;
          console.log('in Nav constructor');
          console.log(this.authenticated);
          if (this.authenticated) {
            if(this.user !== null) {
              this.userService.getUserIDByGmail(this.user.email)
                  .subscribe( res  => {
                    if (res[0] !== null) {
                      console.log('You are logged in.');
                      // this.router.navigate(['/projects', 'dashboard']);
                      // this.router.navigate(['/projects/{id}']);
                    } 
                    // else {
                    //    this.router.navigate(['/register']);
                    // }
                  });
            }
          } 
          // else {
          //     this.router.navigate(['/landing']);
          // }
        });
  }
  goDashboard() {
    if(this.authenticated === true){
      this.router.navigate(['projects/', 'dashboard']);
    } else {
      alert('Please Log in or register.');
    }
  }
  toProfile() {
    this.router.navigate(['/projects', 'profile']);
  }
 }


