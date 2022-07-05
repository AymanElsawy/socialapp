import { MessageService } from './../../services/message.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Component, OnDestroy, OnInit, Renderer2, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment'
import io from "socket.io-client";
import { UserService } from 'src/app/services/user.service';
import _ from 'lodash';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output('onlineUser') onlineUser = new EventEmitter();
  currentUser;
  notifications = [];
  unreadNotifications = [];
  socket;
  chatList = [];
  messages = [];
  count = 0;
  photoVersion;
  photoId;
  photoUrl: string ="https://res.cloudinary.com/des1acmba/image/upload/v";

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private renderer: Renderer2,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
    this.init();
    this.currentUser = this.tokenService.getPayload(); // get current user
    this.socket.emit('online', { room: 'global', userId: this.currentUser._id }); // emit event to socket.io server
    this.getUser(); // get user
    this.socket.on('refreshPage', () => {   // listen for event from socket.io server
      this.getUser(); // get user
    }) //end of listen for event from socket.io server

  } // end of ngOnInit

  ngAfterViewInit(): void {
    this.socket.on('onlineUsers', (data) => {// listen for event from socket.io server
      this.onlineUser.emit(data); // emit event to component

    }) // listen for event from socket.io server
  } // end of ngAfterViewInit
  logOut() {
    if (this.tokenService.getToken()) { // if token is not empty
      this.socket.disconnect(); // disconnect from socket.io server
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
    if (this.router.url.includes('/chat')) {
      setTimeout(() => {
        this.getUser();
      }, 2000)
    } // if url includes chat
    this.userService.getUser(this.currentUser._id).subscribe(data => {
      this.photoVersion = data['user'].photoVersion; // get photo version
      this.photoId = data['user'].photoId; // get photo id
      this.messages = [];
      this.notifications = data['user'].notifications.reverse(); // get current user notifications
      this.unreadNotifications = this.notifications.filter(
        notification => notification.read === false
      ); // get unread notifications
      this.chatList = data['user'].chatList; // get chat list

      this.chatList.forEach(element => {
        if (this.router.url === `/chat/${element.receiverId._id}`) {
          this.messageService.markMessages(element.receiverId._id, this.currentUser._id).subscribe(
            data => {
            }
          );
        }   // for each element in chat list
        let msgs = element['messageId']['messages']; // get messages
        this.messages.push(
          msgs.filter((message) => message.isRead === false && message.receiverId === this.currentUser._id) // get unread messages
        );
        this.count = this.messages.length;
        _.forEach(this.messages, (message) => {
          if (_.isEmpty(message)) {
            this.count--
          }
        }); // get last message
      })
    });
  } // get user

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  } // get time from now

  calenderDate(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: '[Last Week]',
      sameElse: 'DD/MM/YYYY'
    }); // get calendar date
  } // get calendar date



  markAllAsRead() {
    this.userService.markAllAsRead().subscribe(data => { // mark all notifications as read
      this.socket.emit('refresh', {}); // emit event to socket.io server
    }
    );
  } // mark all notifications as read

  openMessage(senderId) {
    this.router.navigate(['/chat', senderId]); // navigate to message page
    this.messageService.markMessages(senderId, this.currentUser._id).subscribe(data => { // mark messages as read
      console.log(data);
      this.socket.emit('refresh', {}); // emit event to socket.io server
    });
  }

  markAllMessagesAsRead() {
    this.messageService.markAllMessages().subscribe(data => { // mark all messages as read
      this.count = 0;
      this.socket.emit('refresh', {}); // emit event to socket.io server
    })

  }  // mark all messages as read

  ngOnDestroy(): void {
    let over = document.getElementsByClassName('sidenav-overlay'); // get all sidenav-overlay

    this.renderer.removeClass(over[0], 'sidenav-overlay'); // remove class from sidenav-overlay
  }

}
