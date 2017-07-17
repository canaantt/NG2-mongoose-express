import { Component, OnInit, ViewChild} from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { StateService } from '../service/state.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers:[ StateService ]
})

export class NavbarComponent implements OnInit {
  @ViewChild(LoginComponent) loginComponent: LoginComponent;

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
          alert("GOT USER");
          console.log("........" + res)
          
          this.user = res;
          // console.log('in Nav constructor');
          // console.log(this.user);
        });
  }
  // refresh() {
  //   this.stateService.authenticated
  //       .subscribe(res => {
  //         this.authenticated = res;
  //         console.log("in Nav OnInit");
  //         console.log(this.authenticated);
  //       });
  //   this.stateService.user
  //       .subscribe(res => {
  //         this.user = res;
  //         console.log("in Nav OnInit");
  //         console.log(this.user);
  //       });
  // }
  ngOnInit(){
    
  }
//   authCB() {
//     console.log('in authentiation call back function');
//     this.loginComponent.monitor();
//     this.refresh();
//   }
//   pLoginAction (event) {
//     console.log(event);
//     // this.authenticated = event;
//     this.stateService.authenticated.next(event);
//     this.authCB();
//     this.refresh();
//   }
//   getUserInfo (event) {
//     console.log(event);
//     this.stateService.user.next(event);
//     this.refresh();
//   }
 }


