import { LoadingComponent } from './../loading/loading.component';
import { AuthService } from './../../services/auth.service';
import { AuthTabsComponent } from './auth-tabs.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthTabsComponent,
    LoginComponent,
    SignupComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
