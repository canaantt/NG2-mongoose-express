import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../service/user.service';
// import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  newUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  submit() {
    this.userService.create(this.newUserForm.value).subscribe(() => {
      alert("New User is added into Database.");
    });
  }

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('World', Validators.minLength(4)),
      Photo: new FormControl(''),
      Email: new FormControl(''),
      Group: new FormControl('')
    });
  }

}
