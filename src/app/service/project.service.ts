import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Project } from '../project';

@Injectable()
export class ProjectService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private projectsUrl = 'http://localhost:3000/projects';  // URL to web api

  constructor(private http: Http) {}

  getProjects(): Promise<Project[]> {
    return this.http.get(this.projectsUrl)
               .toPromise()
               .then(response => response.json() as Project[])
               .catch(this.handleError);
  }

  delete(project: Project): Promise<void> {
    const url = `${this.projectsUrl}/` + project._id;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(project: Project): Promise<Project> {
    return this.http
      .post(this.projectsUrl, JSON.stringify(project), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Project)
      .catch(this.handleError);
  }

  update(project: Project): Promise<Project> {
    const url = `${this.projectsUrl}/` + project._id;
    return this.http
      .put(url, JSON.stringify(project), {headers: this.headers})
      .toPromise()
      .then(() => project)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

