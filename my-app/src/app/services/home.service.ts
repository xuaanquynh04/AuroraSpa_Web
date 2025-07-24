import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IProduct } from '../interface/product';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
    my_url = "http://localhost:3000/home"
    constructor(private h:HttpClient) { }
    getnewProducts(): Observable<any>{
      return this.h.get<any>(this.my_url).pipe(
        retry(2), catchError(this.handleError)
      )
    }
    handleError(error: HttpErrorResponse){
      return throwError(() => new Error(error.message))
    }
}
