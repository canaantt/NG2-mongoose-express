import { Component, OnInit } from '@angular/core';

import { User }        from './user';
import { UserService } from './service/user.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.UserService.getUsers()
      .then(users => this.users = users.slice(1, 5));
  }
}
