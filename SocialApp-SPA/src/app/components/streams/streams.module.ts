import { TokenService } from './../../services/token.service';
import { StreamsComponent } from './streams.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamsRoutingModule } from './streams-routing.module';
import { NavbarComponent } from '../navbar/navbar.component';


@NgModule({
  declarations: [
    StreamsComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    StreamsRoutingModule
  ],
  providers: [
    TokenService
  ]
})
export class StreamsModule { }
