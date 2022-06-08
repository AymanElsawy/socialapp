import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from './services/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private tokenService: TokenService, private router: Router , private route:ActivatedRoute) { }
  ngOnInit(): void {
    
     
  }
 
  title = 'SocialApp-SPA';
}
