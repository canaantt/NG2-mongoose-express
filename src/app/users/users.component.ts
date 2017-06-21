import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../service/user.service';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  users: User[];
  selectedUser: User;
  newUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  getUsers(): void {
    this.userService.getUsers()
        .subscribe(res => {
          this.users = res.json();
        });
  }
  onSelect(user: User): void {
    this.selectedUser = user;
  }
  delete(user: User): void {
    this.userService.delete(user).subscribe(response => {
      this.getUsers();
    });
  }
  submit() {
    this.userService.create(this.newUserForm.value).subscribe(() => this.getUsers());
  }

  ngOnInit(): void {
    this.getUsers();
    this.newUserForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('World', Validators.minLength(4)),
      Photo: new FormControl(''),
      Email: new FormControl(''),
      Group: new FormControl('')
    });
  }
}
