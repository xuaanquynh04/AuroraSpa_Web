import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignInService {
  appURL='http://localhost:3000/sign-in'
  constructor(private http: HttpClient) { }
  authenticate(account: string, password: string): Observable<any> {
    return this.http.post(this.appURL, { account, password })
    .pipe(retry(2),catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse){
    console.error('API Error:', error)
    return throwError(() => error);
  }
}
