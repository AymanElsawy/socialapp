import { TokenService } from './../../services/token.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage;
  loading =false;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService) { }

  ngOnInit() {
    this.init();
  }
  init() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }
  signupUser() {
    console.log(this.signupForm.value);
    this.authService.addUser(this.signupForm.value).subscribe(
      data => {
        // console.log(data);
        this.loading = true;
        setTimeout(() => {
          this.tokenService.setToken(data.token)
          this.router.navigate(['/streams'])
          this.loading= false
        }, 2000);
      },
      err => {
        console.log(err);
        if (err.error.message) {
          this.errorMessage = err.error.message
        }
      }
    )
  }
}
