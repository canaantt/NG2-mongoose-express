import { Component, OnInit, Input } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Permission } from '../permission';
import { PermissionService } from '../service/permission.service';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { UserEmailValidators } from '../validators/userEmail.validator';
enum roles {'admin', 'read-write', 'read-only'};
@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {
  constructor(private userService: UserService) {}
  transform(id: string): Observable<string> {
      return this.userService.getUsersByID(id)
      .map(res => res[0].FirstName + ' ' + res[0].LastName);
  }
}
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  providers: [ PermissionService, UserService, FormBuilder ]
})
export class PermissionsComponent implements OnInit {
  permissions: any;
  newPermissionForm: FormGroup;
  permissions$: Observable<any>;
  roles= ['admin', 'read-write', 'read-only'];
  @Input() project: any;
  id: string;
  emailError: string;

  constructor( private userService: UserService,
               private permissionService: PermissionService,
               private fb: FormBuilder ) { }

  ngOnInit() {
    this.newPermissionForm = this.fb.group({Permissions: this.fb.array([this.permissionItem('')])});
    this.id = this.project._id;
    this.getPermissions();
    // this.newPermissionForm.valueChanges.debounceTime(500).subscribe(data => {
    //   console.log(data);
    // });
  }

  getPermissions(): void {
    this.permissions$ = this.permissionService.getPermissionsByProjectID(this.id);
  }

  permissionItem(val: string) {
    return new FormGroup({
      Email: new FormControl(val, [Validators.required, Validators.minLength(10), UserEmailValidators.UserEmailFormat]),
      Role: new FormControl('read-only', Validators.required)
    });
  }

  addPermission(formValue: any) {
    const p =  new Permission();
    this.userService.userValidationByEmail(formValue.Email)
        .subscribe(res => {
          console.log(res[0]);
          if (typeof(res[0]) !== 'undefined') {
            p.User = res[0]._id;
            p.Project = this.project._id;
            p.Role = formValue.Role;
            this.permissionService.create(p).subscribe(() => this.getPermissions());
          } else {
            this.emailError = 'Email is not in the user list.';
          }
          console.log(this.emailError);
        });
  }

  submitPermissions(): void {
    this.newPermissionForm.get('Permissions').value.forEach(element => {
      this.addPermission(element);
    });
    this.newPermissionForm.get('Permissions').value = null;
  }

  updatePermission(permission: Permission, permissionRole: roles) {
    this.permissionService.update(permission, permissionRole).subscribe(() => this.getPermissions);
  }
  updatePermissions(){
    console.log("within updatePermissions");
    this.newPermissionForm.get('Permissions').value.forEach(element => {
      console.log(element);
      this.updatePermission(element, element.Role);
    })
  }

  deletePermission(permission: Permission) {
    this.permissionService.delete(permission).subscribe(() => this.getPermissions());
  }
}
