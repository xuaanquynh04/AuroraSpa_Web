import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductTypeService } from '../services/product.type.service';
import { ActivatedRoute, RouterModule, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  selectedRange: any
  private urlsub: Subscription | undefined = undefined
  products: any
  err: any
  type: any
  errMsg: any
  filterproducts: any
  filtered = false
  nofiltered = true
  constructor(private ser_: ProductTypeService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.nofiltered = true
    this.filtered = false
    this.urlsub = this.route.url.subscribe((segments: UrlSegment[]) =>{
      this.type = segments[1].path
      console.log(this.type)
      this.ser_.getProductbyType(this.type).subscribe({
        next: (data) => {this.products = data;
          console.log(this.filterproducts); 
          },
        error: (err) => { this.errMsg = err }
      })
      this.nofiltered = true
      this.filtered = false;
      this.selectedRange = null
    })
    
  }
  filterPrice() {
    this.nofiltered = false
    this.filtered = true
    this.filterproducts = []
    if (this.selectedRange == "0") {
      this.ngOnInit()
    } else
    if (this.selectedRange.startsWith(">")) {
      let range = parseInt(this.selectedRange.substring(1))
      for (let p of this.products) {
        if (p.price>=range) {
          this.filterproducts.push(p)
        }
      }
    } else if (this.selectedRange.startsWith("<")) {
      let range = parseInt(this.selectedRange.substring(1))
      for (let p of this.products) {
        if (p.price <range) {
          this.filterproducts.push(p)
        }
      }
    } else {
      let range = this.selectedRange.split("-")
      for (let i=0;i<range.length;i++) {
        range[i] = parseInt(range[i].trim())
      }
      for (let p of this.products) {
        if ((p.price>=range[0]) && (p.price<=range[1])) {
          this.filterproducts.push(p)
        }
      }
    }
    console.log(this.filterproducts)
  }
  formatCurrency(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
