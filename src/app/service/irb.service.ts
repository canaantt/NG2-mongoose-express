import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { IRB } from '../irb';

@Injectable()
export class IrbService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private irbsUrl = 'http://localhost:3000/irbs';  // URL to web api

  constructor(private http: Http) {}

  getIrbs(): Promise<IRB[]> {
    return this.http.get(this.irbsUrl)
               .toPromise()
               .then(response => response.json() as IRB[])
               .catch(this.handleError);
  }

  delete(irb: IRB): Promise<void> {
    const url = `${this.irbsUrl}/` + irb._id;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(irb: IRB): Promise<IRB> {
    return this.http
      .post(this.irbsUrl, JSON.stringify(irb), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as IRB)
      .catch(this.handleError);
  }

  update(irb: IRB): Promise<IRB> {
    const url = `${this.irbsUrl}/` + irb._id;
    return this.http
      .put(url, JSON.stringify(irb), {headers: this.headers})
      .toPromise()
      .then(() => irb)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

