import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { StateService } from '../service/state.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  newUserForm: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private stateService: StateService,
    private router: Router
  ) {
    this.stateService.user.subscribe(res => this.user = res);
  }

  submit() {
    this.userService.create(this.newUserForm.value).subscribe(() => {
      alert("New User is added into Database.");
      this.router.navigate(['/projects', '/dashboard']);
    });
  }

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      FirstName: new FormControl(''),
      LastName: new FormControl(''),
      Photo: new FormControl(''),
      Email: new FormControl(''),
      Gmail: this.user.email,
      Group: new FormControl('')
    });
  }

}
