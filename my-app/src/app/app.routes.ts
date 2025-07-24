import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BookingComponent } from './booking/booking.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
    {path:"", component:HomeComponent},
    {path:"home", component:HomeComponent},
    {path:"product/:productType", component:ProductComponent},
    {path:"product/:productType/:productID", component:ProductDetailComponent},
    {path:"sign-in", component:SignInComponent},
    {path:"sign-up", component:SignUpComponent},
    {path:"booking", component:BookingComponent},
    {path:"cart", component:CartComponent},
    {path:"payment",component:PaymentComponent}
];
