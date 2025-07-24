import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {
  my_url = "http://localhost:3000/product/"
  constructor(private h:HttpClient) { }
  getProductDetail(type: string, id: string): Observable<any> {
    return this.h.get<any>(this.my_url + type +"/" + id).pipe(
      retry(2), catchError(this.handleError)
    )
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
