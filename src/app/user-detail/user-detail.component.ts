import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Observable } from 'rxjs/Observable';
import { DateFormatter } from '../projects-dashboard/projects-dashboard.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  // @Input() user: User;
  id: any;
  user: any;
  formattedDate: string;

  constructor(private route: ActivatedRoute,
              private userService: UserService) {
                this.id = this.route.snapshot.params['id'];
                this.userService.getUsersByID(this.id)
                    .subscribe(res => {
                      console.log(res);
                      this.user = res[0];
                    });
              }

  update(user: User): void {
    this.userService.update(user).subscribe(() => console.log('updating...'));
  }
}
