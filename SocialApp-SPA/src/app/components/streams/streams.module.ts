import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PostService } from './../../services/post.service';
import { TokenService } from './../../services/token.service';
import { StreamsComponent } from './streams.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamsRoutingModule } from './streams-routing.module';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';
import { SideComponent } from '../side/side.component';
import { PostComponent } from '../post/post.component';
import { PostsComponent } from '../posts/posts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from 'src/app/services/token-interceptor';


@NgModule({
  declarations: [
    StreamsComponent,
    NavbarComponent,
    LoadingComponent,
    SideComponent,
    PostComponent,
    PostsComponent
  ],
  imports: [
    CommonModule,
    StreamsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    LoadingComponent
  ],
  providers: [
    TokenService,
    PostService,
    {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true}
  ]
})
export class StreamsModule { }
