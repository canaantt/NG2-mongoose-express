import { Component,  OnInit}          from '@angular/core';
import { User }        from './user';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Data Uploading';
  users: User[] = [];

  constructor(private userService: UserService) { }
  
  getUsers(): void {
    this.userService.getUsers()
      .then(users => this.users = users);
  }
  
  getUserById(id : number): void {
    console.log(id);
    this.userService.getUser(id)
      .then(user => this.users[0] = user);
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .then(users => this.users = users);
    
  }
}
