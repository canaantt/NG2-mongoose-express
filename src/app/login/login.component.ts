import { Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import * as hello from 'hellojs';
import { StateService } from '../service/state.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[ StateService ]
})
export class LoginComponent implements OnInit {
  GOOGLE_CLIENT_ID = '1098022410981-p7n5ejjji8qlvdtff274pol54jo5i8ks.apps.googleusercontent.com';
  @Input() authenticated;
  @Output('loginAction') loginAction: EventEmitter<any> = new EventEmitter<any>();
  @Output('sendUserInfo') sendUserInfo: EventEmitter<any> = new EventEmitter<any>();
  @Input() user;
  constructor(private stateService: StateService) {
    hello.init({
      google: this.GOOGLE_CLIENT_ID
    }, {
      force: true,
      redirect_uri: '/landing'});
      hello.on('auth.login', this.authLogin.bind(this));
      hello.on('auth.logout', function(auth){
       console.log(auth);
       console.log('logged out');
       this.sendUserInfo.emit(null);
     });
  }
  ngOnInit(){
    // this.stateService.authenticated
    //     .subscribe(res => {
    //       this.authenticated = res;
    //       console.log("in Child OnInit");
    //       console.log(this.authenticated);
    //     });
    this.stateService.user
        .subscribe(res => {
          this.user = res;
          console.log("in Child OnInit");
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
              }, this.sendingData.bind(this, true));
  }


  googleLogOut(): any {
    hello.logout('google', {}, this.sendingData.bind(this, false));
  }


  authLogin(auth){
    hello('google').api('me').then( this.updateUserInfo.bind(this) );    
  }
  
  updateUserInfo(v){
    console.log(this.stateService.user);
    this.stateService.user.next(v);
  }

  sendingData(v: boolean): void {
    console.log(v);
    console.log('in sending data');
    this.loginAction.emit(v);
  }

}
