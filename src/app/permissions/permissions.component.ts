import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Permission } from '../permission';
import { PermissionService } from '../service/permission.service';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Project } from '../project';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  providers: [ PermissionService, UserService, FormBuilder ]
})
export class PermissionsComponent implements OnInit {
  permissions: Permission[];
  newPermissionForm: FormGroup; 
  @Input() project: any;

  constructor( private userService: UserService,
               private permissionService: PermissionService,
               private fb: FormBuilder ) { }

  ngOnInit() {
    //this.getPermissions();
    this.newPermissionForm = this.fb.group({
      Email: new FormControl('New Email', Validators.required),
      Role: new FormControl('', Validators.minLength(4))
    });
    console.log(this.newPermissionForm.value);
  }

  getPermissions(): void {
    this.permissionService.getPermissionsByProjectID(this.project._id)
                          .subscribe(res => this.permissions = res.json());
  }
  addPermission(formValue: any) {
    let p =  new Permission();
    this.userService.userValidationByEmail(formValue.get('Email'))
        .subscribe(res => {
          
        });
  }

}
