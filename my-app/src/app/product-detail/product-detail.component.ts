import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductDetailService } from '../services/product.detail.service';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICustomize, IOptions } from '../interface/customize';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private urlsub: Subscription | undefined = undefined;
  product_detail: any;
  err: any;
  type: any;
  id: any;
  errMsg: any;
  product: any;
  customizes: ICustomize[] = [];
  feedbacks: any;
  selectedOptions: { [key: string]: any} = {};
  productForm: FormGroup;
  sum!: number;

  constructor(
    private ser_: ProductDetailService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.urlsub = this.route.url.subscribe((segments: UrlSegment[]) => {
      this.type = segments[1].path;
      console.log(this.type);
      this.id = segments[2].path;
      console.log(this.id);
      this.ser_.getProductDetail(this.type, this.id).subscribe({
        next: (data) => {
          this.product_detail = data;
          this.product = this.product_detail.product;
          this.customizes = this.product_detail.customizes;
          this.feedbacks = this.product.feedback;
          console.log(this.product)
          console.log(this.feedbacks)
          this.sum = this.product.price
          console.log(this.sum)
          this.createCustomizeForm();
          
          console.log('Form Structure:', this.productForm.controls);
        },
        error: (err) => {
          this.err = err;
        }
      });
    });
  }

  createCustomizeForm() {
    const formGroup: { [key: string]: any } = {};
    
    this.customizes.forEach((customize: ICustomize) => {
      console.log('Creating controls for:', customize.name);

      if (customize.optionType === 'radio') {
        formGroup[customize._id] = ['', customize.required ? [Validators.required] : []];
      } else if (customize.optionType === 'checkbox') {
        const checkboxControls: { [key: string]: any[] } = {};
        customize.options.forEach(opt => {
          checkboxControls[opt.value] = [false];
        });
        formGroup[customize._id] = this.fb.group(checkboxControls);
      }
    });

    this.productForm = this.fb.group(formGroup);
    
    console.log('Form created:', {
      controls: Object.keys(this.productForm.controls),
      value: this.productForm.value
    });
    
    this.productForm.valueChanges.subscribe(val => {
      console.log('Form values changed:', val);
      this.calculateTotal();
    });
  }

  calculateTotal() {
    let baseprice = this.product.price
    this.customizes.forEach(cus => {
      if (cus.optionType === 'radio') {
        const selectedValue = this.productForm.get(cus._id)?.value;
        // console.log(selectedValue)
        if (selectedValue) {
          const selectedOption = cus.options.find(opt => opt.value === selectedValue);
          if (selectedOption) {
            // console.log(selectedOption.addPrice)
            baseprice += selectedOption.addPrice;
            this.sum = baseprice
            // console.log(this.sum)
          }
        }
      } else if (cus.optionType === 'checkbox') {
        const checkboxGroup = this.productForm.get(cus._id) as FormGroup;
        if (checkboxGroup) {
          Object.keys(checkboxGroup.controls).forEach(optValue => {
            if (checkboxGroup.get(optValue)?.value) {
              const selectedOption = cus.options.find(opt => opt.value === optValue);
              if (selectedOption) {
                baseprice += selectedOption.addPrice;
                this.sum = baseprice
                console.log(this.sum)
              }
            }
          });
        }
      }
    });
  }
  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form submitted:', this.productForm.value);
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  getSelectedOptions(): IOptions[] {
    const selectedOptions: IOptions[] = [];
    
    this.customizes.forEach(customize => {
      if (customize.optionType === 'radio') {
        const selectedValue = this.productForm.get(customize._id)?.value;
        if (selectedValue) {
          const selectedOption = customize.options.find(opt => opt.value === selectedValue);
          if (selectedOption) {
            selectedOptions.push(selectedOption);
            // console.log(selectedOptions)
          }
        }
      } else if (customize.optionType === 'checkbox') {
        const checkboxGroup = this.productForm.get(customize._id) as FormGroup;
        if (checkboxGroup) {
          Object.keys(checkboxGroup.controls).forEach(optValue => {
            if (checkboxGroup.get(optValue)?.value) {
              const selectedOption = customize.options.find(opt => opt.value === optValue);
              if (selectedOption) {
                selectedOptions.push(selectedOption);
                // console.log(selectedOptions)
              }
            }
          });
        }
      }
    });
    
    return selectedOptions;
  }
  addToCart() {
    if (this.productForm.valid) {
      const selectedOptions = this.getSelectedOptions();  // Lấy các options đã chọn
      this.cartService.addToCart(
        this.product,
        selectedOptions,  // Truyền vào CartService
        this.sum
      );
      console.log("đã thêm")
      console.log(this.cartService.getCartItems())
        }
  }
  formatCurrency(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  getDisplayProductType(type: string): string {
    switch(type) {
        case '67caff0983c2d7f120045343':
            return 'nail';
        case '67caff1e83c2d7f120045345':
            return 'wash';
        case '67caff2d83c2d7f120045347':
            return 'wax';
        default:
            return type;
    }
}
}
