import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  @Input() user: User;
  constructor(private userService: UserService) { }

  update(user: User): void {
    this.userService.update(user).subscribe(() => console.log('updating...'));
  }
}
