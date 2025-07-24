import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../interface/user';
import { SignUpService } from '../services/sign-up.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
function validateEmailOrPhone(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
 
  // Regex cho email và số điện thoại
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^[0-9]{10}$/;  // số điện thoại có 10 số
 
  if (!value) return null;  // Bỏ qua nếu trống (đã có required validator)
 
  // Kiểm tra nếu là email hoặc số điện thoại hợp lệ
  if (emailRegex.test(value) || phoneRegex.test(value)) {
    return null;
  }
 
  return { invalidFormat: true };
}
@Component({
  selector: 'app-sign-up',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  userlist: User[]=[];
  signup_form!: FormGroup;
  showSuccess: boolean = false;
  constructor(private register:SignUpService,private router:Router){}
  ngOnInit(): void {
    this.signup_form=new FormGroup({
      account: new FormControl('',[Validators.required,validateEmailOrPhone]),
      name: new FormControl('',Validators.required),
      gender: new FormControl('1',[Validators.required]),
      dob: new FormControl('',[Validators.required]),
      avatar:new FormControl(''),
      password: new FormControl('',[Validators.required])
    })
  }
  navigateToHome(){
    this.router.navigate(['/home']);
  }
  onSubmit(){
    console.log('Form data before sending:', this.signup_form.value);
    if (this.signup_form.get('account')?.invalid) {
      alert('Vui lòng nhập đúng định dạng email hoặc số điện thoại!');
      return;
    }
    if (this.signup_form.invalid) {
      Object.keys(this.signup_form.controls).forEach(key => {
        const control = this.signup_form.get(key);
        control?.markAsTouched();
      });
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
  }


    this.userlist.push(this.signup_form.value as User);
    console.log(this.signup_form.value)
   
    this.register.postData(this.signup_form.value).subscribe({
      next: (response) => {
        console.log('success');
        this.showSuccess = true;
        this.signup_form.reset();
        // Đợi 3 giây rồi chuyển trang
        setTimeout(() => {
          this.showSuccess = false;},3000)
        // setTimeout(() => {
        //   this.router.navigate(['/home']);
        // }, 3000);
        //  ;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          const errorMessage = error.error.message;
          if (errorMessage === "Tài khoản đã tồn tại!") {
           
            alert("Tài khoản đã tồn tại! Vui lòng đăng nhập.");
          }
        } else {
          // console.log("=== Lỗi khác:", error);
          alert("Có lỗi xảy ra, vui lòng thử lại sau!");
        }
      }
    });
  }
}
