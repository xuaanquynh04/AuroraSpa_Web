import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { User } from '../interface/user';


@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  apiURL='http://localhost:3000/sign-up'
  constructor(private http:HttpClient){}
 
  postData(data:User):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
 
    console.log('Sending data:', data)
    return this.http.post(this.apiURL,data,{ headers })
    .pipe(retry(2),catchError(this.handleError))
  }
  handleError(error: HttpErrorResponse){
    console.error('API Error:', error)
    return throwError(() => error);
  }
}


