import { Component, Input, OnInit}          from '@angular/core';
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
  newUser: User;
  selectedUser: User;
  newUserForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService
  ) {}
  
  getUsers(): void {
    this.userService.getUsers()
      .then(users => this.users = users);
  }
  delete(user: User): void{
    this.userService.delete(user);
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .then(users => this.users = users);

    this.newUserForm = this.fb.group({
      FirstName: new FormControl('Hello', Validators.required),
      LastName: new FormControl('World', Validators.minLength(4)),
      Photo: new FormControl(''),
      Email: new FormControl('')
    });
  }
  submit() {
    console.log("Reactive Form submitted: ", this.newUserForm);
    this.newUser = this.newUserForm.value;
    console.log(this.newUser);
    this.userService.create(this.newUser);
  }
  onSelect(user: User): void {
    this.selectedUser = user;
  }
}
