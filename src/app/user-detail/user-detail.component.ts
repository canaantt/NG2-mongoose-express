import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent{
  @Input() user: User;
  constructor() { }

  update(user: User): void {


    user.save();
    
    console.log("in updating");
  }
}
