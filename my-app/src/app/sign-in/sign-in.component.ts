import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInService } from '../services/sign-in.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-sign-in',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  userlist: any[]=[];
  signin_form!: FormGroup;
  showSuccess: boolean = false;
  constructor(private service: SignInService,private router:Router) { }
 
  ngOnInit(): void {
    this.signin_form=new FormGroup({
      account: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  }
  navigateToSignUp(){
    this.router.navigate(['/sign-up']);
  }
  navigateToHome(){
    this.router.navigate(['/home']);
  }
  onSubmit(){
   
    if (this.signin_form.invalid) {
      Object.keys(this.signin_form.controls).forEach(key => {
        const control = this.signin_form.get(key);
        control?.markAsTouched();
      });
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
  }
    this.service.authenticate(this.signin_form.value.account, this.signin_form.value.password).subscribe({
      next: (response) => {
        console.log('success')
        this.showSuccess = true;
        this.signin_form.reset();
        setTimeout(() => {
          this.showSuccess = false}, 3000);
      },
        // setTimeout(() => {
          // this.router.navigate(['/home'])}, 3000),
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status===400){
          const errorMessage = error.error.message;
          if(errorMessage === "Tài khoản chưa được đăng ký"){
            console.log("=== Phát hiện tài khoản chưa được đăng ký");
            alert("Tài khoản chưa được đăng ký! Vui lòng đăng ký tài khoản.");
          }
          else if(errorMessage === "Mật khẩu không chính xác"){
            console.log("=== Phát hiện mật khẩu không chính xác");
            alert("Mật khẩu không chính xác! Vui lòng nhập lại mật khẩu.");
          }
        }else{
          console.log("=== Lỗi khác:", error);
          alert("Có lỗi xảy ra, vui lòng thử lại sau!");
        }
      }
    });
  }
}

