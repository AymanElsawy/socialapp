import { RouterModule } from '@angular/router';
import { SideComponent } from './../components/side/side.component';
import { NavbarComponent } from './../components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    NavbarComponent,
    SideComponent,
    

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule
  
  ], exports: [
    NavbarComponent,
    SideComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class SharedModule { }
