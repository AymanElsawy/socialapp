import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit , OnDestroy{

  user;
  constructor(private tokenService: TokenService,private router:Router,private renderer:Renderer2) { }

  ngOnInit(): void {
    const navbar = document.querySelectorAll('.sidenav');
    var navbarElement = M.Sidenav.init(navbar, {});
    this.user = this.tokenService.getPayload()
  }
  logOut() {
    this.tokenService.removeToken();
    this.router.navigate(['']);
   }
  
  ngOnDestroy(): void {
    let over = document.getElementsByClassName('sidenav-overlay');
    
    this.renderer.removeClass(over[0], 'sidenav-overlay');
  }

}
