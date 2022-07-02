import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosComponent } from './photos.component';


@NgModule({
  declarations: [
    PhotosComponent
  ],
  imports: [
    CommonModule,
    PhotosRoutingModule,
    SharedModule
  ]
})
export class PhotosModule { }
