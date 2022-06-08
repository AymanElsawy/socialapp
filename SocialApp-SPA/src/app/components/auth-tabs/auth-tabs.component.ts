import { Router } from '@angular/router';
import { TokenService } from './../../services/token.service';
import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
@Component({
  selector: 'app-auth-tabs',
  templateUrl: './auth-tabs.component.html',
  styleUrls: ['./auth-tabs.component.css']
})
export class AuthTabsComponent implements OnInit {

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    const token = this.tokenService.getToken()
    if (token) {
      this.router.navigate(['streams'])
    }
    const tabs = document.querySelectorAll('.tabs');
    const instance = M.Tabs.init(tabs, {
      swipeable: true
    });


  }

}
