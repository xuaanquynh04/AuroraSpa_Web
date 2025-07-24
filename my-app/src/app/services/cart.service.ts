import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../interface/product';
import { IOptions } from '../interface/customize';
import { ICartitem } from '../interface/cartitem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Khởi tạo BehaviorSubject với dữ liệu từ localStorage
  private cartItems = new BehaviorSubject<ICartitem[]>(this.getInitialCart());
  
  constructor() {
    // Lấy dữ liệu từ localStorage khi service được khởi tạo
    const savedCart = this.getInitialCart();
    this.cartItems.next(savedCart);
  }

  private getInitialCart(): ICartitem[] {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  private saveCart(items: ICartitem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    console.log('đã lưu vào localstorage')
    this.cartItems.next(items);  
  }

  getCartItems() {
    return this.cartItems.asObservable();
  }

  addToCart(product: IProduct, selectedOptions: IOptions[], itemPrice: number, quantity: number = 1) {
    const currentItems = this.cartItems.getValue();
    
    const existingItemIndex = currentItems.findIndex(item => 
      item.product._id === product._id && 
      this.areOptionsEqual(item.selectedOptions, selectedOptions)
    );

    if (existingItemIndex > -1) {
      alert('Dịch vụ đã có trong giỏ hàng');
    } else {
      currentItems.push({ 
        product, 
        selectedOptions, 
        quantity: 1,
        itemPrice  // Lưu giá đã được tính từ ProductDetailComponent
      });
      alert('Đã thêm vào giỏ hàng')
    }

    this.cartItems.next(currentItems);
    this.saveCart(currentItems);
  }

  private areOptionsEqual(options1: IOptions[], options2: IOptions[]): boolean {
    if (options1.length !== options2.length) return false;
    return options1.every(opt1 => 
      options2.some(opt2 => 
        opt1.value === opt2.value && 
        opt1.name === opt2.name && 
        opt1.addPrice === opt2.addPrice
      )
    );
  }



  removeFromCart(index: number) {
    const currentItems = this.cartItems.getValue();
    currentItems.splice(index, 1);
    this.cartItems.next(currentItems);
    this.saveCart(currentItems);
  }

}
