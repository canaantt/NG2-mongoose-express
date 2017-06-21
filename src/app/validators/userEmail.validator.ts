import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class UserEmailValidators {
  static UserEmailFormat(control: AbstractControl) {
    if (control.value.search('[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+') > -1) {
      console.log('Within UserEmail static Function UserEmail function...');
      return null;
    }
    return {validEmailFormat: true};
  }
  private usersUrl = 'http://localhost:3000/users';
  static UserEmailStatus(control: AbstractControl) {
    if (control.value.search('[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+') > -1) {
      console.log('Within UserEmail static Function UserEmail function...');
      return null;
    }
    return {validEmailNotExist: true};
  }
  //  constructor( private userService: UserService,
  //              private permissionService: PermissionService ) {}

  // emailUserCollection(control: AbstractControl) {
  //   this.userService.userValidationByEmail(control.value).subscribe(val => {
  //     if (val.json.length === 0) {
  //       return {validEmailinUserCollection: true };
  //     } else {
  //       return null;
  //     }
  //   });
  // }
}
