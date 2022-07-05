import { AlertifyService } from './../services/alertify.service';
import { MessageService } from './../services/message.service';
import { UserService } from './../services/user.service';
import { PostService } from './../services/post.service';
import { TokenService } from './../services/token.service';
import { PostsComponent } from './../components/posts/posts.component';
import { PostComponent } from './../components/post/post.component';
import { RouterModule } from '@angular/router';
import { SideComponent } from './../components/side/side.component';
import { NavbarComponent } from './../components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TopStreamsComponent } from '../components/top-streams/top-streams.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../services/token-interceptor';
import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { SafePipe } from './safe.pipe';



@NgModule({
  declarations: [	
    NavbarComponent,
    SideComponent,
    TopStreamsComponent,
    PostComponent,
    PostsComponent,
      SafePipe
   ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxAutoScrollModule,
    NgxPaginationModule,
    


  ], exports: [
    NavbarComponent,
    SideComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PostComponent,
    PostsComponent,
    TopStreamsComponent,
    NgxAutoScrollModule,
    
   
  ],
  providers: [
    TokenService,
    PostService,
    UserService,
    MessageService,
    
    AlertifyService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
})
export class SharedModule { }
