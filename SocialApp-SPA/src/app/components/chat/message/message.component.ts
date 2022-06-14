import { MessageService } from '../../../services/message.service';
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import io from "socket.io-client";
import * as moment from 'moment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit {

  receiverId: string;
  senderId: string;
  receiverData;
  senderData;
  message;
  messages = [];
  socket;
  typing: boolean;
  typingMessage;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server

  }

  ngOnInit(): void {
    this.senderData = this.tokenService.getPayload(); // get user data from token
    this.senderId = this.senderData._id; // get user id from token
    this.route.params.subscribe(params => {
      this.receiverId = params.id; // get id from url
      this.getReceiverData(); // get user (receiver)
      this.socket.on('refreshPage', () => {   // listen for event from socket.io server
        this.getMessages(this.senderData._id, this.receiverData._id); // get messages
      }) //end of listen for event from socket.io server
    })

    this.socket.on('is-typing', data => {  // listen for event from socket.io server for is typing
      if (data.sender == this.receiverId) { // if senderid equal receiverid
        this.typing = true; // set typing to true
      }
    }) // end of listen for event from socket.io server
    this.socket.on('stoped-typing', data => {  // listen for event from socket.io server for stop typing
      if (data.sender == this.receiverId) { // if senderid equal receiverid
        this.typing = false; // set typing to false
      }
    }) // end of listen for event from socket.io server


  }

  ngAfterViewInit() {
    const params = {
      sender: this.senderId,
      receiver: this.receiverId
    }
    this.socket.emit('refresh-chat', params); // emit event to refresh-chat page from socket.io server
  } // end of ngAfterViewInit

  getReceiverData() {
    this.userService.getUser(this.receiverId).subscribe(data => {  // get user from server
      this.receiverData = data['user']; // get user data from server
      this.getMessages(this.senderData._id, this.receiverData._id); // get messages from server
    }); // subscribe to get user

  } // get user receiver data

  sendMessage() {
    this.messageService.sendMessage(
      this.senderData._id,
      this.receiverData._id,
      this.receiverData.username,
      this.message).subscribe(data => {
        this.message = '';
        this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page from socket.io server

      })
  }

  getMessages(senderId, receiverId) {
    this.messageService.getAllMessages(senderId, receiverId).subscribe(data => {   // get messages from server
      this.messages = data['message']['messages']; // get messages from server
    }) // subscribe to get messages
  } // get messages

  isTyping() {
    this.socket.emit('typing', {
      sender: this.senderId, // send sender id to socket.io server
      receiver: this.receiverId // send receiver id to socket.io server
    }); 
    if (this.typingMessage) {  // if typingMessage is true
      clearTimeout(this.typingMessage); // clear timeout
    } // end of if typingMessage is true
   this.typingMessage = setTimeout(() => { // set timeout
     this.socket.emit('stop-typing', {
       sender: this.senderId,
       receiver: this.receiverId 
     })
   }, 1000); // set timeout
  }

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  }

}
