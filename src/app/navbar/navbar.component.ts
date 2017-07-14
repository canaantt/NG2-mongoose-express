import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [LoginServiceService]
})

export class NavbarComponent implements OnInit {

  constructor(private loginService: LoginServiceService) {
   }

  ngOnInit() {
  }

  login(): any {
    console.log('in nav component');
    this.loginService.googleLogin();
  }
  logout(): any {
    console.log('in nav component logout');
    this.loginService.googleLogOut();
  }

}
