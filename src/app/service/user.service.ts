import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../user.interface';

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private usersUrl = 'http://localhost:3000/users';  // URL to web api

  constructor(private http: Http) { }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
               .toPromise()
               .then(response => response.json() as User[])
               .catch(this.handleError);
  }

  delete(user: User): Promise<void> {
    const url = `${this.usersUrl}/`+ user._id;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(user: User): Promise<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as User)
      .catch(this.handleError);
  }

  update(user: User): Promise<User> {
    const url = `${this.usersUrl}/` + user._id;
    return this.http
      .put(url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

