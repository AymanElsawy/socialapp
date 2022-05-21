import { TokenService } from './../../services/token.service';
import { StreamsComponent } from './streams.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamsRoutingModule } from './streams-routing.module';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';


@NgModule({
  declarations: [
    StreamsComponent,
    NavbarComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    StreamsRoutingModule
  ],
  exports: [
    LoadingComponent
  ],
  providers: [
    TokenService
  ]
})
export class StreamsModule { }
