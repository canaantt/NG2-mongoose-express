import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Permission } from '../permission';
import { User } from '../user';
enum roles {'full-access', 'read-only'};
@Injectable()
export class PermissionService {
  
  private headers = new Headers({'Content-Type': 'application/json'});
  private permissionsUrl = 'http://localhost:3000/permissions';  // URL to web api

  constructor(private http: Http) {}

  getPermissions():  Observable<Response> {
    return this.http.get(this.permissionsUrl);
  }
  getPermissionByID(id: string): Observable<Response> {
    return this.http.get(this.permissionsUrl)
            .map(res => res.json().filter(value => value._id === id));
  }
  getPermissionsByProjectID(id: string): Observable<Response> {
    console.log(id);
    return this.http.get(this.permissionsUrl)
            .map(res => res.json().filter(value => value.Project === id));
  }
  getPermissionsByIDs(ids: string[]): Observable<Response> {
    return this.http.get(this.permissionsUrl)
            .map(res => res.json().filter(value => ids.indexOf(value._id) > -1));
  }
  delete(permission: Permission): Observable<Response> {
    const url = `${this.permissionsUrl}/` + permission._id;
    return this.http.delete(url, {headers: this.headers});
  }

  create(permission: Permission): Observable<Response> {
    return this.http
      .post(this.permissionsUrl, JSON.stringify(permission), {headers: this.headers});
  }

  update(permission: Permission, permissionRole: roles): Observable<Response> {
    const url = `${this.permissionsUrl}/` + permission._id;
    permission.Role = permissionRole;
    return this.http.put(url, JSON.stringify(permission), {headers: this.headers});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

