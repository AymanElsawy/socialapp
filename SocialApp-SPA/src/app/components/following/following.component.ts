import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import io from "socket.io-client";

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  currentUser; 
  currentUserFollowing = []
  socket; 
  photoUrl = 'https://res.cloudinary.com/des1acmba/image/upload/v';
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
      this.currentUserFollowing = data['user'].following; // get current user following
    }); // subscribe to get user
  } // get user

  unfollowUser(user) {
    const userId = user.userfollowed._id; //  user id
    this.userService.unfollowUser(userId).subscribe(data => {  // unfollow user
      this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page from socket.io server
    })
  } // unfollow user

}
