import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IProduct } from '../interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  my_url = "http://localhost:3000/product/"
  constructor(private h:HttpClient) { }
  getProductbyType(type: string): Observable<IProduct[]>{
    return this.h.get<any>(this.my_url + type).pipe(
      retry(2), catchError(this.handleError)
    )
  }
  handleError(error: HttpErrorResponse){
    return throwError(() => new Error(error.message))
  }
}
