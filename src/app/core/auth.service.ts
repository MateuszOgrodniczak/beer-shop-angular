import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {
  }

  attemptAuth(username: string, password: string): Observable<any> {
    const credentials = {username, password};
    console.log('attempAuth');
    return this.http.post<any>('http://localhost:8080/token/generate-token', credentials);
  }

}
