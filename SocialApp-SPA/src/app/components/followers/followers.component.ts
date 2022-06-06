import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import _ from "lodash";

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  currentUser;
  currentUserFollowers = [];
  currentUserFollowing = [];
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
    }); // subscribe to get user
  } // get user

  unfollowUser(user) {
    const userId = user.follower._id; //  user id
    this.userService.unfollowUser(userId).subscribe(data => {  // unfollow user
      this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page from socket.io server
    })
  } // unfollow user

  followUser(user) {
    const userId = user.follower._id; //  user id
    this.userService.followUser(userId).subscribe(data => {
      this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page from socket.io server
    })
  } // follow user

  isFollowed(id) {
    const r = _.find(this.currentUserFollowing, ['userfollowed._id', id]); // find user in current user following
    if (r) return true; // if user is found in current user following return true
    else return false; // if user is not found in current user following return false

  } // is followed

}
