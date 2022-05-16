import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const navbar = document.querySelectorAll('.sidenav');
    var navbarElement = M.Sidenav.init(navbar, {});
  }
  logOut(){}

}
