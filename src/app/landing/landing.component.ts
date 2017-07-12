import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [LoginServiceService]
})
export class LandingComponent implements OnInit {
  GOOGLE_CLIENT_ID = '1098022410981-p7n5ejjji8qlvdtff274pol54jo5i8ks.apps.googleusercontent.com';

  constructor(private loginService: LoginServiceService) {
   }
  ngOnInit() {
    console.log('landing component in ngOnInit');
    // hello.init({
    //   // facebook: FACEBOOK_CLIENT_ID,
    //   // windows: WINDOWS_CLIENT_ID,
    //   google: this.GOOGLE_CLIENT_ID
    // }, {redirect_uri: '/consent'});
    // hello.on('auth.login', function(auth){
    //   console.log(auth);
    //   console.log("logged in");
    // });
    // hello.on('auth.logout', function(auth){
    //   console.log(auth);
    //   console.log("logged out");
    // });
  }

  login(): any {
    console.log('in landing component');
    this.loginService.googleLogin();
  }
  logout(): any {
    console.log('in landing component logout');
    this.loginService.googleLogOut();
  }
}
