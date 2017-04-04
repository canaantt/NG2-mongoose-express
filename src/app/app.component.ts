import { Component,  OnInit}          from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User }        from './user.interface';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'Data Uploading';
  users: User[] = [];
  newUserForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService
  ) {}
  
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

    this.newUserForm = this.fb.group({
      firstName: new FormControl('Hello', Validators.required),
      lastName: new FormControl('World'),
      photo: new FormControl(''),
      email: new FormControl('')
    })
  }

  submit() {
    console.log("Reactive Form submitted: ", this.newUserForm);
  }  
    
}
