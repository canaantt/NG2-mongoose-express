import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { File } from '../file';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';

@Injectable()
export class FileService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private filesUrl = 'http://localhost:3000/files';
  private fileUploadingUrl = 'http://localhost:3000/upload';
  constructor(private http: Http) {}

  getFilesByProjectID(id: string): Observable<Response> {
    const url = `${this.filesUrl}/` + id;
    console.log(url);
    return this.http.get(url)
               .map(res => {
                 console.log(res);
                  return res.json();
                });
            // .map(res => res.json().filter(value => value.Project === id));
  }

  removeAllFiles(id: string): Observable<Response> {
    console.log("Within file service removing all the files related to the project");
    console.log(id);
    const url = `${this.filesUrl}/` + id;
    console.log(url);
    return this.http.delete(url);
  }
  create(file: File): Observable<Response> {
    return this.http
      .post(this.filesUrl, JSON.stringify(file), {headers: this.headers});
  }

  upload(file: File): Observable<Response> {
    const url = `${this.fileUploadingUrl}/` + file._id;
    console.log(file._id);
    return this.http
      .post(url, JSON.stringify(file), {headers: this.headers});
  }

  sendProjectID(projectID: string): Observable<Response> {
    console.log("Within File service sendProjectID function");
    console.log(projectID);
    console.log(this.filesUrl);
    let file = new File();
    file.Project = projectID;
    file.Name = null;
    file.Category = null;
    file.DataType = null;
    file.Size = 0;

    console.log( JSON.stringify(file));
    return this.http
      .post(this.filesUrl, JSON.stringify(file), {headers: this.headers});
  }

  update(file: File): Observable<Response> {
    const url = `${this.filesUrl}/` + file._id;
    return this.http
      .put(url, JSON.stringify(file), {headers: this.headers});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

