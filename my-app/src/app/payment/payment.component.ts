import { Component, OnInit } from '@angular/core';
import { IBookingform } from '../interface/bookingform';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { CommonModule, formatCurrency } from '@angular/common';
import { PaymentService } from '../services/payment.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  showPopup: boolean = false;
  bookingData!: IBookingform
  paymentForm: FormGroup;
  discount: number = 0;
  loaded: boolean = false;
  buttonDisabled: boolean = true;
  constructor(private fb: FormBuilder,
    private bookingser: BookingService,
    private paymentser: PaymentService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.bookingser.refreshBookingData().subscribe((data: IBookingform) => {
      this.loaded = true;
      this.bookingData = data;
      console.log('from payment component');
      console.log(this.bookingData);
    })
    }
  formatCurrency(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  validatePaymentMethod() {
    this.paymentForm.get('paymentMethod')?.markAsTouched()
    if (this.paymentForm.valid) {this.buttonDisabled = false} }
  confirmPayment() {
    this.bookingData.paymentMethod = this.paymentForm.get('paymentMethod')?.value; 
    this.bookingData.status = 'ordered';
    console.log(this.bookingData);
    this.saveOrder();
    this.showPopup = true;
  }
  closePopup() {
    this.showPopup = false;
  }
  saveOrder() {
    this.paymentser.saveOrder(this.bookingData).subscribe({
      next: (response) => console.log(response, 'success')
    })
  }
}
