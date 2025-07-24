import { Component, OnInit } from '@angular/core';
import { ICartitem } from '../interface/cartitem';
import { CartService } from '../services/cart.service';
import { CommonModule, formatCurrency } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartItems: ICartitem[] = [];
  totalPrice: number = 0;
  selectedAll: boolean = false;
  selectedItems: boolean[] = [];
  selectedService: ICartitem[] = [];
  canBook: boolean = true;
  totalItems: number = 0;
  
  constructor(
    private cartService: CartService,
    private bookingService: BookingService,
    private router: Router
  ) {}
  ngOnInit(): void {
    
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.countTotalItems();
      console.log(this.cartItems)
    });
  }
  countTotalItems() {
    this.totalItems = this.cartItems.length;
  }
  removeItem(index: number) {
    this.cartService.removeFromCart(index);
    this.ngOnInit();
  }
  selectAll() {
    this.selectedAll = !this.selectedAll;
    console.log(this.selectedAll)
    for (let i=0; i<this.cartItems.length; i++) {
      this.selectedItems[i] = this.selectedAll;
    }
    this.calculateTotal();
    this.countTotalItems();
    this.logicSelectedService();
  }
  selectItem(index: number) {
    this.canBook = true;
    this.selectedItems[index] = !this.selectedItems[index];
    console.log(index)
    console.log(this.selectedItems)
    console.log(this.selectedItems[index])
    let countfalse = 0;
    let counttrue = 0;
    for (let i=0; i<this.cartItems.length; i++) {
      if (!this.selectedItems[i]) {
        countfalse++;
      } else counttrue++;
    }
    if (countfalse == this.cartItems.length) {
      this.selectedAll = false;
    }
    if (counttrue < this.cartItems.length) {
      this.selectedAll = false;
    }
    if (countfalse == 0) {
      this.selectedAll = true;
    }
    console.log('canbook o selecteditem')
    console.log(this.canBook)
    this.calculateTotal();
    this.countTotalItems();
    this.logicSelectedService();
  }
  calculateTotal() {
    this.totalPrice = 0;
    for (let i=0; i<this.cartItems.length;i++) {
      if (this.selectedItems[i]) {
        this.totalPrice += this.cartItems[i].itemPrice
    }
  }}
  getSelectedService() {
    this.selectedService = [];
    for (let i=0; i<this.cartItems.length;i++) {
      if (this.selectedItems[i]) {
        this.selectedService.push(this.cartItems[i])}}
    console.log("selectedService")
    console.log(this.selectedService)
  }
  logicSelectedService() {
    this.canBook = true;
    this.getSelectedService();
    let countnail = 0;
    let countwash = 0;
    for (let i=0; i<this.selectedService.length;i++) {
      if (this.selectedService[i].product.productType == '67caff0983c2d7f120045343') {
        countnail++;}
      if (this.selectedService[i].product.productType == '67caff1e83c2d7f120045345') {
        countwash++;}
      console.log("countwash", countwash)
      console.log("countnail", countnail)
    }
    let waxids = []
    for (let i=0; i<this.selectedService.length;i++) {
      if (this.selectedService[i].product.productType=="67caff2d83c2d7f120045347") {
        waxids.push(this.selectedService[i].product._id)}}
    let uniquewaxids = [...new Set(waxids)]
    console.log("uniquewaxids", uniquewaxids)
    console.log("waxids", waxids)
    if (countnail>1 || countwash>1) {this.canBook = true;}
    else if (waxids.length != uniquewaxids.length) {this.canBook = true;}
    else if (this.selectedService.length == 0 ) {this.canBook = true}
    else this.canBook = false;
    console.log(this.canBook)
  }
  bookService() {
    this.bookingService.refreshSelectedServices(this.selectedService);
    this.router.navigate(['/booking']);
  }
  formatCurrency(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
