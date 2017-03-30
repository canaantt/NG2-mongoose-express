import { Component,  OnInit}          from '@angular/core';
import { User }        from './user';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
    <div class="grid grid-pad">
      <div class="grid grid-pad">
      <label *ngFor="let user of users"  class="col-1-4">
        {{user.LastName}}, {{user.FirstName}} 
      </label>
    </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Data Uploading';
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers()
      .then(users => this.users = users);
  }
}
