import { StreamsModule } from './../streams/streams.module';
import { AuthService } from './../../services/auth.service';
import { AuthTabsComponent } from './auth-tabs.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthTabsComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    StreamsModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
