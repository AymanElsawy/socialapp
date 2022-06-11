import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PostService } from './../../services/post.service';
import { TokenService } from './../../services/token.service';
import { StreamsComponent } from './streams.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamsRoutingModule } from './streams-routing.module';
import { TokenInterceptor } from 'src/app/services/token-interceptor';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    StreamsComponent,
  ],
  imports: [
    CommonModule,
    StreamsRoutingModule,
    SharedModule
  ]
})
export class StreamsModule { }
