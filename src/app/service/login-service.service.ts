import { Injectable } from '@angular/core';
import * as hello from 'hellojs';

@Injectable()
export class LoginServiceService {
  GOOGLE_CLIENT_ID = '1098022410981-p7n5ejjji8qlvdtff274pol54jo5i8ks.apps.googleusercontent.com';

  constructor() {
    hello.init({
      google: this.GOOGLE_CLIENT_ID
    }, {
      force: true,
      redirect_uri: '/landing'});

    hello.on('auth.login', function(auth){
      hello('google').api('me').then( function(v){
        console.log(v);
      });
      console.log(auth);
      console.log('logged in');
    });
    hello.on('auth.logout', function(auth){
      console.log(auth);
      console.log('logged out');
    });
  }

  googleLogin(): any {
    alert('Hello');
    hello.login('google', {
                 display: 'popup',
                 response_type: 'token',
                 scope: 'email',
                 redirect_uri: '/landing'
             }, function(){
               console.log('logged in...');
             });
    // hello.login('google',function(response, e){
    //   if (e) { console.log(e.error.message); }
    // });
  }
  googleLogOut(): any {
    hello.logout('google', function(response, e){
      console.log('logged in');
      console.log(response);
      if (e) { console.log(e.error.message); }
    });
  }
}
