import { Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import * as hello from 'hellojs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  GOOGLE_CLIENT_ID = '1098022410981-p7n5ejjji8qlvdtff274pol54jo5i8ks.apps.googleusercontent.com';
  @Input() authenticated;
  @Output('loginAction') loginAction: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    hello.init({
      google: this.GOOGLE_CLIENT_ID
    }, {
      force: true,
      redirect_uri: '/landing'});

    hello.on('auth.on', function(){

    });
    hello.on('auth.out', function(){

    });
  }

  googleLogin(): any {
    alert('Hello');
    console.log('In login component', this.authenticated);
    hello.login('google', {
                 display: 'popup',
                 response_type: 'token',
                 scope: 'email',
                 redirect_uri: '/landing'
              }, this.sendingData.bind(this, true));
  }
  googleLogOut(): any {
    hello.logout('google', function(response, e){
      console.log('logged in');
      console.log(response);
      if (e) { console.log(e.error.message); }
    });
    this.sendingData.bind(this, false);
  }

  sendingData(v: boolean): void {
    console.log(v);
    console.log('in sending data');
    this.loginAction.emit(v);
  }

}
