import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService:TokenService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        let token = this.tokenService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            }); 
        }
        return next.handle(request);
    }

   
}
