import { UserService } from './service/user.service';

export class User {

  static userService: UserService;

   static getUsers(): Promise<User[]> {
    User.userService.getUsers();
   }




  _id: string;
  FirstName: string;
  LastName: string;
  Photo: string;
  Email: string;

  private isNew: boolean;

  constructor(private userService: UserService) {
    this.isNew = true;
   };


  delete(): void {
    this.userService.delete(this);
  };
  save(): void {
    this.userService.create(this);
    this.userService.update(this);
  };
}

