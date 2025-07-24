import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICartitem } from '../interface/cartitem';
import { IBookingform } from '../interface/bookingform';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private url='http://localhost:3000/';
  private selectedServices = new BehaviorSubject<ICartitem[]>([]);
  private bookingData = new BehaviorSubject<IBookingform>({} as IBookingform);
  refreshSelectedServices(services: ICartitem[]) {
    this.selectedServices.next(services);
  }
  getSelectedServices() {
    return this.selectedServices.asObservable();
  }

  getBookingData(data: IBookingform) {
    this.bookingData.next(data);
  }
  refreshBookingData() {
    return this.bookingData.asObservable();
  }
  // saveBookingData(data: IBookingform) {
}
