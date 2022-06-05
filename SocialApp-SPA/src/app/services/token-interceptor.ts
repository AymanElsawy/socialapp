import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    helper: JwtHelperService;
    constructor(private tokenService:TokenService , private router:Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        this.helper = new JwtHelperService(); // create new instance of JwtHelperService
        let token = this.tokenService.getToken(); // get token from cookies storage
        if (token) {
            if (this.helper.isTokenExpired(token)) {
                this.router.navigate(['']); // redirect to login page if token is expired
                this.tokenService.removeToken(); // remove token from cookies storage
                
            } else {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}` // set token to Authorization header
                    }
                });
            } 
        }
        return next.handle(request); // send request to server
    }

   
}
