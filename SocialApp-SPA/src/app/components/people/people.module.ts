
import { StreamsModule } from './../streams/streams.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/services/token-interceptor';


@NgModule({
  declarations: [
    PeopleComponent
  ],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    StreamsModule,
  ],
  providers:[{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true}]
})
export class PeopleModule { }
