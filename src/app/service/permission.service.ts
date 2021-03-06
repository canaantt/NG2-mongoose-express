import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Permission } from '../permission';
import { User } from '../user';
import 'rxjs/add/observable/forkJoin';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/observable/of';

enum roles {'admin', 'read-write', 'read-only'};
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
    return this.http.get(this.permissionsUrl)
            .map(res => res.json().filter(value => value.Project === id));
  }
  getPermissionsByUserID(id: string): Observable<Response> {
    return this.http.get(this.permissionsUrl)
            .map(res => res.json().filter(value => value.User === id));
  }
  getPermissionsByIDs(ids: string[]): Observable<Response> {
    return this.http.get(this.permissionsUrl)
            .map(res => res.json().filter(value => ids.indexOf(value._id) > -1));
  }
  getPermissionByUserByProject(userID: string, projectID: string): Observable<Response> {
    console.log(userID);
    console.log(projectID);
    return this.http.get(this.permissionsUrl)
            .map(res => res.json().filter(value => (value.User===userID && value.Project===projectID))[0]);
  }
  removePermisionsByProjectID(id: string): any  {
    this.http.get(this.permissionsUrl)
        .map(res => res.json().filter(value => value.Project === id)
        .map(permission => permission._id))
        .subscribe(res => {
          console.log('All permissions related to ProjectID ', id, ' are ', res);
          this.deletePermissions(res).subscribe();
        });
  }

  deletePermissions( inputObject ) {
    const observableBatch = [];
    inputObject.forEach(( item, key ) => {
      observableBatch.push( this.http.delete('http://localhost:3000/permissions/' + item).map((res: Response) => res.json()) );
    });
    return Observable.forkJoin(observableBatch);
  }

  delete(permission: Permission): Observable<Response> {
    const url = `${this.permissionsUrl}/` + permission._id;
    return this.http.delete(url, {headers: this.headers});
  }
  deleteById(id: string): Observable<Response> {
    console.log(id);
    const url = `${this.permissionsUrl}/` + id;
    return this.http.delete(url, {headers: this.headers});
  }
  create(permission: any): Observable<Response> {
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

