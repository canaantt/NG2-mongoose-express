import { Component, Input, OnInit}          from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User }        from './user';
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
  onSelect(user: User): void {
    this.selectedUser = user;
  }
  delete(user: User): void{
    this.userService.delete(user).then((value: void) => this.getUsers());
  }
  submit() {
    this.userService.create(this.newUserForm.value).then((value: any) => this.getUsers());
  }

  ngOnInit(): void {
    this.getUsers();

    this.newUserForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('World', Validators.minLength(4)),
      Photo: new FormControl(''),
      Email: new FormControl('')
    });
    console.log(this.newUserForm.get('FirstName'));
  }
}
