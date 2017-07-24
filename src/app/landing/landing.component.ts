import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  authenticated = false;
  user: any;

  constructor( private stateService: StateService,
               private userService: UserService,
               private router: Router) {
    this.stateService.user
        .subscribe(res => {
          this.user = res;
          // if('email' in this.user){
          //   this.userService.getUserIDByGmail(this.user.email)
          //     .subscribe(res => {
          //       console.log('......' + res[0]);
          //       console.log(res);
          //     });
          // }
        });
    this.stateService.authenticated
        .subscribe(res => {
          this.authenticated = res;
          console.log('in Nav constructor');
          console.log(this.authenticated);
          if (this.authenticated) {
            if(this.user !== null) {
              this.userService.getUserIDByGmail(this.user.email)
                  .subscribe(res => {
                    if (typeof(res[0]) !== 'undefined') {
                      console.log("Found user", res[0]);
                      // this.router.navigate(['/projects', 'dashboard']);
                      // this.router.navigate(['/projects/{id}']);
                    } else {
                      console.log("couldn't find this user from user collection");
                       this.router.navigate(['/register']);
                    }
                  });
            }
          } else {
              this.router.navigate(['/landing']);
          }
        });
  }
  
  goDashboard() {
    if(this.authenticated === true){
      this.router.navigate(['projects/', 'dashboard']);
    } else {
      alert('Please Log in or register.');
    }
  }
  goAdmin() {
    console.log('need to set lock for this feature.');
    this.router.navigate(['admin']);
  }
 }
