import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { File } from '../file';

@Injectable()
export class FileService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private filesUrl = 'http://localhost:3000/files';  // URL to web api

  constructor(private http: Http) {}

  getFiles(): Promise<File[]> {
    return this.http.get(this.filesUrl)
               .toPromise()
               .then(response => response.json() as File[])
               .catch(this.handleError);
  }

  delete(file: File): Promise<void> {
    const url = `${this.filesUrl}/` + file._id;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(file: File): Promise<File> {
    return this.http
      .post(this.filesUrl, JSON.stringify(file), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as File)
      .catch(this.handleError);
  }

  update(file: File): Promise<File> {
    const url = `${this.filesUrl}/` + file._id;
    return this.http
      .put(url, JSON.stringify(file), {headers: this.headers})
      .toPromise()
      .then(() => file)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

