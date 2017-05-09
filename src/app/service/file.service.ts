import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { File } from '../file';

@Injectable()
export class FileService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private filesUrl = 'http://localhost:3000/files';
  private fileUploadingUrl = 'http://localhost:3000/uploads';
  constructor(private http: Http) {}

  getFiles(): Observable<Response> {
    return this.http.get(this.filesUrl)
            .map(res => res.json());
  }
  getFilesByIDs(ids: string[]): Observable<Response> {
    return this.http.get(this.filesUrl)
            .map(res => res.json().filter(value => ids.indexOf(value._id) > -1));
  }
  getFileByID(id: string): Observable<Response> {
    const url = `${this.filesUrl}/` + id;
    return this.http.get(url);
  }

  delete(file: File): Observable<Response> {
    const url = `${this.filesUrl}/` + file._id;
    return this.http.delete(url, {headers: this.headers});
  }

  create(file: File): Observable<Response> {
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

