import { AuthModule } from './../auth-tabs/auth.module';
import { StreamsModule } from './../streams/streams.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsRoutingModule } from './comments-routing.module';
import { CommentsComponent } from './comments.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    CommentsComponent
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    StreamsModule,
    AuthModule,
    NgxPaginationModule
  ]
})
export class CommentsModule { }
