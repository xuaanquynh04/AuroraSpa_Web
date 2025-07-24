import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { ICartitem } from '../interface/cartitem';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBookingform } from '../interface/bookingform';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  buttonDisabled: boolean=true
  showPopup: { [serviceID: string]: boolean } = {}
  allTimeSelected: boolean=false
  conflict: boolean=true
  bookForm: FormGroup;
  selectedServices: ICartitem[] = []
  selectedTimes: { [serviceID: string]: Date } = {}
  total: number = 0;
  timeslots: Date[] = []
  constructor(private fb: FormBuilder,
    private router: Router,
    private bookingser: BookingService) {
      this.bookForm = this.fb.group({
        customerId: [''],
        customerName: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        bookingDate: ['', [Validators.required]],
      })
    }
  generateSlots() {
    const slots: Date[] = []
    const today = new Date()
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute<60; minute += 30) {
        let time = new Date(today)
        time.setHours(hour, minute, 0);
        slots.push(time)
      }
    }
    this.timeslots = slots
    console.log(this.timeslots)
  }
  setPopupstatus() {
    for (let service of this.selectedServices) {
      this.showPopup[service.product._id] = false;
    }
  }
  ngOnInit(): void { 
    this.setPopupstatus()
    this.generateSlots()
    this.bookingser.getSelectedServices().subscribe(services => {
      this.selectedServices = services;
      this.calculateTotal();
      console.log(this.selectedServices)
      console.log(this.total)
    })
    this.bookForm.valueChanges.subscribe(() => this.validate())
  }

  getPopup(serviceId: string) {
    this.showPopup[serviceId] = true;
  }
  closePopup(serviceId: string) {
    this.showPopup[serviceId] = false;
  }
  selectTime(time: Date, serviceId: string) { 
    console.log(time, serviceId)
    this.selectedTimes[serviceId] = time;
    this.checkallTime()
    this.timeConflict()
    this.validate()
    console.log('all')
    console.log(this.selectedTimes)
    this.closePopup(serviceId)
  }
  isTimeSelected(time: Date, serviceId: string): boolean {
    const selectedTime = this.selectedTimes[serviceId];
    if (!selectedTime) return false;
    
    return selectedTime.getHours() === time.getHours() && 
           selectedTime.getMinutes() === time.getMinutes();
  }
  calculateTotal() {
    let sum = 0
    for (let service of this.selectedServices) {
      sum += service.itemPrice}
    this.total = sum;}
  
  formatCurrency(price: number): string {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');}
  timeConflict() {
    this.conflict = false
    for (let i=0; i<this.selectedServices.length; i++) {
      for (let j=i+1; j<this.selectedServices.length; j++) {
        if (this.selectedTimes[this.selectedServices[i].product._id] == this.selectedTimes[this.selectedServices[j].product._id]) {
          console.log("conflict")
          this.conflict = true
        }
      }
    }
  }
  checkallTime() {
    if (Object.keys(this.selectedTimes).length != this.selectedServices.length) {
        this.allTimeSelected = false
    } else this.allTimeSelected = true
  }
  validate() {
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.get(key)?.markAsTouched();
    });
    console.log('form valid')
    console.log(this.bookForm.valid)
    console.log('all selected')
    console.log(this.allTimeSelected)
    console.log('conflict')
    console.log(this.conflict)
    if (this.bookForm.valid == true && this.allTimeSelected == true && this.conflict == false) {
      this.buttonDisabled = false
      console.log(this.buttonDisabled)
    } else {this.buttonDisabled = true; console.log(this.buttonDisabled)}
  }
  prepareBookingData(): IBookingform {
    const bookingData: IBookingform = {
      customerID: this.bookForm.value.customerId,
      customerName: this.bookForm.value.customerName,
      phone: this.bookForm.value.phone,
      orderTime: new Date(),  // Thời điểm đặt hàng
      bookingDate: new Date(this.bookForm.value.bookingDate),
      paymentMethod: '',  // Để trống, sẽ được điền ở trang payment
      total: this.total,
      status: 'pending',  // Trạng thái ban đầu
      bookingItems: this.selectedServices.map(service => ({
        product: service,
        selectedTime: this.selectedTimes[service.product._id]
      }))
    };
    return bookingData;
  }
  updateBookingData() {
    const bookingData = this.prepareBookingData();
    this.bookingser.getBookingData(bookingData);
    console.log(bookingData)
    this.router.navigate(['/payment']);
    console.log('success')
  }
}