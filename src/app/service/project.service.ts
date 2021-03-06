import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../project';

@Injectable()
export class ProjectService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private projectsUrl = 'http://localhost:3000/projects';  // URL to web api

  constructor(private http: Http ){}
              // ,private fileService: FileService) {}

  getProjects(): Observable<Response> {
    return this.http.get(this.projectsUrl);
  }

  getRecentProject(userID: string): Observable<Response> {
    console.log('in project service, user ID is ', userID);
     return this.http.get(this.projectsUrl)
                 .map(res => {
                   let filtered = res.json().filter(value => value.Author === userID);
                   return filtered[filtered.length-1];
                  });
  }

  getProjectByID(id: string): Observable<Response> {
    const url = `${this.projectsUrl}/` + id;
    return this.http.get(url).map(res => res.json());
  }
  getProjectsByIDs(ids: string[]): Observable<Response> {
    return this.http.get(this.projectsUrl)
               .map(res => res.json().filter(value => ids.indexOf(value._id) > -1));

  }

  getProjectByUserID(id: string): Observable<Response> {
    const url = `${this.projectsUrl}/` + id;
    return this.http.get(url).map(res => res.json());
  }
  delete(project: Project): Observable<Response> {
    const url = `${this.projectsUrl}/` + project._id;
    return this.http.delete(url, {headers: this.headers});
  }

  create(project: Project): Observable<Response> {
    console.log('in project service...', project);
    return this.http
      .post(this.projectsUrl, JSON.stringify(project), {headers: this.headers});
  }

  update(project: Project): Observable<Response> {
    console.log(project);
    const url = `${this.projectsUrl}/` + project._id;
    return this.http
      .put(url, JSON.stringify(project), {headers: this.headers});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

