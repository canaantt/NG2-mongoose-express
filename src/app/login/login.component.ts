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
  @Output('sendUserInfo') sendUserInfo: EventEmitter<any> = new EventEmitter<any>();
  @Input() user;
  constructor() {
    hello.init({
      google: this.GOOGLE_CLIENT_ID
    }, {
      force: true,
      redirect_uri: '/landing'});
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
    this.authenticated = true;
  }
  googleLogOut(): any {
    hello.logout('google', this.sendingData.bind(this, false));
  }
  monitor(): any {
    console.log('in child monitor');
    const self = this;
    hello.on('auth.login', function(auth){
      hello('google').api('me').then( function(v){
        console.log(v);
        self.sendUserInfo.emit(v);
      });
     });
     hello.on('auth.logout', function(auth){
       console.log(auth);
       console.log('logged out');
       self.sendUserInfo.emit(null);
     });
  }
  sendingData(v: boolean): void {
    console.log(v);
    console.log('in sending data');
    this.loginAction.emit(v);
    this.loginAction.emit({'hello': 'world',
                           'world': 'hello'});
  }

}
