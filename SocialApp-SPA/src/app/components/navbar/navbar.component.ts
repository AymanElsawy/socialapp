import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import * as moment from 'moment'
import io from "socket.io-client";
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  currentUser;
  notifications = [];
  unreadNotifications = [];
  socket;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private renderer: Renderer2,
    private userService: UserService
  ) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
    this.init();
    this.currentUser = this.tokenService.getPayload(); // get current user
    this.getUser(); // get user
    this.socket.on('refreshPage', () => {   // listen for event from socket.io server
      this.getUser(); // get user
    }) //end of listen for event from socket.io server
  } // end of ngOnInit
  logOut() {
    if (this.tokenService.getToken()) { // if token is not empty
      this.tokenService.removeToken(); // remove token
      this.router.navigate(['']); // navigate to home page
    }

  } // log out

  init() {
    const navbar = document.querySelectorAll('.sidenav'); // get all sidenav
    const navbarElement = M.Sidenav.init(navbar, {
      edge: 'right', // set edge to right
      inDuration: 250, // set in duration to 250
      outDuration: 200, // set out duration to 200
      draggable: true, // set draggable to true

    });
    const dropdown = document.querySelectorAll('.dropdown-trigger'); // get all dropdown
    const dropdonwElement = M.Dropdown.init(dropdown, {
      alignment: 'right', // set alignment to right
      coverTrigger: false, // set cover trigger to false
      inDuration: 400, // set in duration to 400
      outDuration: 400, // set out duration to 400
    });
  } // end of init

  getUser() {
    this.userService.getUser(this.currentUser._id).subscribe(data => {
      this.notifications = data['user'].notifications.reverse(); // get current user notifications
      this.unreadNotifications = this.notifications.filter(
        notification => notification.read === false
      ); // get unread notifications
    });
  } // get user

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  } // get time from now


  markAllAsRead() {
    this.userService.markAllAsRead().subscribe(data => { // mark all notifications as read
      this.socket.emit('refresh', {}); // emit event to socket.io server
    }
    );
  } // mark all notifications as read

  ngOnDestroy(): void {
    let over = document.getElementsByClassName('sidenav-overlay'); // get all sidenav-overlay

    this.renderer.removeClass(over[0], 'sidenav-overlay'); // remove class from sidenav-overlay
  }

}
