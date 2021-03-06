import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../user';

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private usersUrl = 'http://localhost:3000/users';  // URL to web api

  constructor(private http: Http) {}

  getUsers():  Observable<Response> {
    return this.http.get(this.usersUrl);
  }
  getUsersByID(id: string): Observable<Response> {
    return this.http.get(this.usersUrl)
               .map(res => res.json().filter(value => id.indexOf(value._id) > -1));
  }
  getUserIDByGmail(gmail: string): Observable<Response> {
    return this.http.get(this.usersUrl)
               .map(res => res.json().filter(value => value.Gmail === gmail))
               .catch(err => Observable.throw(err));
  }
  getUsersByIDs(ids: string[]): Observable<Response> {
    return this.http.get(this.usersUrl)
               .map(res => res.json().filter(value => ids.indexOf(value._id) > -1));
  }
  userValidationByEmail(email: string): Observable<Response> {
    return this.http.get(this.usersUrl)
               .map(res => res.json().filter(value => value.Email === email))
               .catch(err => Observable.throw(err));
  }

  delete(user: User): Observable<Response> {
    const url = `${this.usersUrl}/` + user._id;
    return this.http.delete(url, {headers: this.headers});
  }

  create(user: User): Observable<Response> {
    console.log('In user service looking for consent info ... ', user);
    return this.http
      .post(this.usersUrl, JSON.stringify(user), {headers: this.headers});
  }

  update(user: User): Observable<Response> {
    const url = `${this.usersUrl}/` + user._id;
    return this.http.put(url, JSON.stringify(user), {headers: this.headers});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

