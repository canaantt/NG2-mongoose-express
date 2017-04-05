import { Component, Input } from '@angular/core';
import { User }        from '../user.interface';
import { UserService } from '../service/user.service';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent{
  @Input() user: User;
  constructor(private userService: UserService){}

  update(user: User): void {
    this.userService.update(user);
    console.log("in updating");
  }
}
