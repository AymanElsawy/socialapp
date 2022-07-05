import { UserService } from './../../services/user.service';
import { TokenService } from './../../services/token.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import io from "socket.io-client";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  currentUser;
  notifications = []; 
  socket;
  photoUrl = 'https://res.cloudinary.com/des1acmba/image/upload/v';


  constructor(private tokenService: TokenService, private userService: UserService) { 
    this.socket = io('http://localhost:3000'); // connect to socket.io server

  }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getPayload(); // get current user
    this.getUser(); // get user
    this.socket.on('refreshPage', () => {   // listen for event from socket.io server
      this.getUser(); // get user
    }) //end of listen for event from socket.io server
  }

  getUser() {
    this.userService.getUser(this.currentUser._id).subscribe(data => {
      this.notifications = data['user'].notifications; // get current user notifications
      console.log(this.notifications);
    });
  } // get user

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  } // get time from now

  markNotification(notification, deleteIt?) {  // mark notification as read or delete
    let d ; 
    if (deleteIt) d = true;   // if deleteIt is true
    else d = false; // if deleteIt is false
    this.userService.markAsReadOrDelete(notification._id ,d).subscribe(data => { // mark notification as read
      this.socket.emit('refresh', {}); // emit event to socket.io server
    });
  } // mark notification as read or delete it

  markAllAsRead() {
    this.userService.markAllAsRead().subscribe(data => { // mark all notifications as read
      this.socket.emit('refresh', {}); // emit event to socket.io server
    }
    );
  } // mark all notifications as read


}
