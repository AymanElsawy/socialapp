import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService) { }

  ngOnInit() {
    this.init();
  }
  init() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  loginUser() {
    console.log(this.loginForm.value);
    this.authService.loginUser(this.loginForm.value).subscribe(
      data => {
        // console.log(data);
        this.tokenService.setToken(data.token)
        this.router.navigate(['/streams'])
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
