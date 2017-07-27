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
    this.newUserForm.value.Consent = true;
    this.newUserForm.value.Gmail = this.user.email;
    this.userService.create(this.newUserForm.value).subscribe(() => {
      alert("New User is added into Database.");
      this.router.navigate(['/landing']);
    });
  }

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Email: new FormControl('', Validators.required),
      Institution: new FormControl('', Validators.required)
    });
  }

}
