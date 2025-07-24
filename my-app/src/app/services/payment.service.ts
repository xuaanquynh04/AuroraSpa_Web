import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBookingform } from '../interface/bookingform';
import { catchError, retry, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  my_url = "http://localhost:3000/payment"
  constructor(private h:HttpClient) { }
  saveOrder(order: IBookingform): Observable<any>{
    return this.h.post<any>(this.my_url, order).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error (error.message))
  }
}
