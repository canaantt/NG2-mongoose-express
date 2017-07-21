import { Component, OnInit } from '@angular/core';
import { StateService } from '../service/state.service';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public user: any;
  userID: string;
  // authenticated: boolean;

  constructor(private stateService: StateService,
              private router: Router,
              private userService: UserService) { 
                this.stateService.user
                .subscribe(res => {
                  this.getUserID(res.email);
                });
              }
  ngOnInit() {

  }
  getUserID(id: string): void {
    this.userService.getUserIDByGmail(id)
              .subscribe(res => {
                const userID = res[0]._id;
                this.getUser(userID);
                this.userID = userID;
              });
  }
  getUser(id: string): void {
    this.userService.getUsersByID(id)
        .subscribe(res => {
          console.log('received user is... ', res[0]);
          this.user = res[0];
        });
  }

  update(user: User): void {
    console.log('in update', this.user);
    this.userService.update(user)
        .subscribe(() => console.log('User infomation is updated in the database.'));
  }

}
