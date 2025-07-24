import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeService } from '../services/home.service';
import { ActivatedRoute, RouterLink, UrlSegment } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private urlsub: Subscription | undefined = undefined;;
    products: any
    err: any
    type: any
    errMsg: any
    constructor(private ser_: HomeService,
      private route: ActivatedRoute
    ) {}
    ngOnInit(): void {
      this.urlsub = this.route.url.subscribe(() =>{
        this.ser_.getnewProducts().subscribe({
          next: (data) => {this.products = data; this.processProductTypes(); console.log(this.products)},
          error: (err) => { this.errMsg = err }
        })
      })
    }
    formatCurrency(price: number): string {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    processProductTypes() {
      if (this.products && this.products.products) {
        this.products.products = this.products.products.map((product: any) => {
          switch(product.productType) {
            case '67caff0983c2d7f120045343':
              product.productType = 'nail';
              break;
            case '67caff1e83c2d7f120045345':
              product.productType = 'wash';
              break;
            case '67caff2d83c2d7f120045347':
              product.productType = 'wax';
              break;
          }
          return product;
        });
      }
    }
    
}