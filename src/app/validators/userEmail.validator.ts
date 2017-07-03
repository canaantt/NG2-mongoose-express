import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';

export class UserEmailValidators {
  static UserEmailFormat(control: AbstractControl) {
    if (control.value.search('[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+') > -1) {
      console.log('Within UserEmail static Function UserEmail function...');
      return null;
    }
    return {validEmailFormat: true};
  }

  // static UserEmailStatus(control: AbstractControl) {
  //   console.log(control.root.get('http://localhost:3000/users'));

  //   //             .map(function(res){
  //   //               console.log(res);
  //   //               return res.json().filter(value => value.Email === control.value);
  //   //             });

  //   // return {validEmailNotExist: true};
  // }

}
