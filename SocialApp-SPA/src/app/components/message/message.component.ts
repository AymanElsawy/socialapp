import { MessageService } from './../../services/message.service';
import { TokenService } from './../../services/token.service';
import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";
import * as moment from 'moment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  receiverId: string;
  receiverData;
  senderData;
  message;
  messages = [];
  socket;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) { 
    this.socket = io('http://localhost:3000'); // connect to socket.io server

  }

  ngOnInit(): void {
    this.senderData = this.tokenService.getPayload(); // get user data from token
    this.route.params.subscribe(params => {
      this.receiverId = params.id; // get id from url
      this.getReceiverData(); // get user (receiver)
      this.socket.on('refreshPage', () => {   // listen for event from socket.io server
        this.getMessages(this.senderData._id, this.receiverData._id); // get messages
      }) //end of listen for event from socket.io server
    })

  }

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
        this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page from socket.io server
      
    })
  }

  getMessages(senderId, receiverId) {
    this.messageService.getAllMessages(senderId, receiverId).subscribe(data => {  
      this.messages = data['message']['messages'];
      console.log(this.messages);
    })
  }

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  }

}
