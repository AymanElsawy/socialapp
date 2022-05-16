import { Router } from '@angular/router';
import { TokenService } from './services/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private tokenService: TokenService, private router: Router) { }
  ngOnInit(): void {
    const token = this.tokenService.getToken()
    if (token) {
      this.router.navigate(['streams'])
    } else {
      this.router.navigate([''])
    }
  }
  title = 'SocialApp-SPA';
}
