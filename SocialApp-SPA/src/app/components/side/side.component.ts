import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
  currentUser;
  currentUserFollowers = [];
  currentUserFollowing = [];
  currentUserPosts = [];

  socket;
  constructor(private userService: UserService, private tokenService: TokenService) {
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
    this.userService.getUser(this.currentUser._id).subscribe(data => {  // get user from server
      this.currentUserFollowers = data['user'].followers; // get current user followers
      this.currentUserFollowing = data['user'].following; // get current user following
      this.currentUserPosts = data['user'].posts; // get current user posts
    }); // subscribe to get user
  } // get user

}
