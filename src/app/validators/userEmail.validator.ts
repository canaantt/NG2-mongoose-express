import { AbstractControl } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Permission } from '../permission';
import { PermissionService } from '../service/permission.service';

export class UserEmailValidators {
  constructor( private userService: UserService, 
               private permissionService: PermissionService ) {}

  static UserEmailFormat(control: AbstractControl) {
    if (control.value.includes('@')) {
      console.log("Within UserEmail static Function UserEmail function...");
      return null;
    }
    return {validEmailFormat: true}
  }
  
}