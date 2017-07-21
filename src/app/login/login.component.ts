import { Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import * as hello from 'hellojs';
import { StateService } from '../service/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  GOOGLE_CLIENT_ID = '1098022410981-p7n5ejjji8qlvdtff274pol54jo5i8ks.apps.googleusercontent.com';
  authenticated = false;
  user: any;

  constructor(private stateService: StateService,
              private router: Router) {
    hello.init({
      google: this.GOOGLE_CLIENT_ID
    }, {
      force: true,
      redirect_uri: '/landing'});
      hello.on('auth.login', this.authLogin.bind(this));
      hello.on('auth.logout', this.authLogout.bind(this));
  }
  ngOnInit() {
    this.stateService.authenticated
        .subscribe(res => {
          this.authenticated = res;
          console.log('in Child OnInit');
          console.log(this.authenticated);
        });
    this.stateService.user
        .subscribe(res => {
          this.user = res;
          console.log('in Child OnInit');
          console.log(this.user);
        });
  }
  googleLogin(): any {
    console.log('In login component', this.authenticated);
    hello.login('google', {
                 display: 'popup',
                 response_type: 'token',
                 scope: 'email',
                 redirect_uri: '/landing'
              }, this.updateAuth.bind(this, true));
  }
  googleLogOut(): any {
    hello.logout('google', {}, this.updateAuth.bind(this, false));
  }
  authLogin(auth) {
    hello('google').api('me').then( this.updateUserInfo.bind(this) );
    // this.router.navigate(['/projects','dashboard']);
  }
  authLogout(auth) {
    this.updateUserInfo.bind(this, null);
    this.updateAuth.bind(this, false);
    this.router.navigate(['/landing']);
  }
  updateUserInfo(v) {
    console.log(this.stateService.user);
    this.stateService.user.next(v);
  }
  updateAuth(v) {
    console.log(this.stateService.authenticated);
    this.stateService.authenticated.next(v);
  }
  toProfile() {
    this.router.navigate(['/projects', 'profile']);
  }
}