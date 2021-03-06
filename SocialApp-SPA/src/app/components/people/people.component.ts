import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import io from "socket.io-client";
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  users = []; // users array
  currentUser; // current user
  currentUserFollowing = []; 
  socket; 
  onlineUsers;

  photoUrl = 'https://res.cloudinary.com/des1acmba/image/upload/v';
  


  constructor(private userService: UserService, private tokenService: TokenService , private router:Router) { 
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getPayload(); // get current user
    this.getAllUsers(); // get all users
    this.getUser(); // get user
    this.socket.on('refreshPage', () => {   // listen for event from socket.io server
      this.getAllUsers(); // get all users
      this.getUser(); // get user
    }) //end of listen for event from socket.io server
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data['users'];   // get users from the server
      _.remove(this.users, { username: this.currentUser.username }); // remove current user from users array
    }); // subscribe to get all users
  } // get all users

  getUser() {
    this.userService.getUser(this.currentUser._id).subscribe(data => {  // get user from server
      this.currentUserFollowing = data['user'].following; // get current user following
      console.log(this.currentUserFollowing);
    }); // subscribe to get user
  } // get user

  isFollowed( id) {
    const r = _.find(this.currentUserFollowing, ['userfollowed._id', id]); // find user in current user following
    if (r) return true; // if user is found in current user following return true
    else return false; // if user is not found in current user following return false
    
  } // is followed

  unfollowUser(user) {
    const userId = user._id; //  user id
    this.userService.unfollowUser(userId).subscribe(data => {  // unfollow user
      this.socket.emit('refresh',{message:'refresh page'}); // emit event to refresh page from socket.io server
     })
  } // unfollow user
  followUser(user) {
    const userId = user._id;
    this.userService.followUser(userId).subscribe(data => { 
      this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page from socket.io server
     })
  } // follow user

  online(event) {
    this.onlineUsers = event;// get online users
  } //online users

  checkIfOnline(id) {
    const result = _.indexOf(this.onlineUsers, id); // get index of receiverId in onlineUsers
    if (result > -1) {
      return true; // set isOnline to true
    } else {
      return false; // set isOnline to false
    }
  } // check if online

  viewProfile(user) {
    this.router.navigate(['profile', user._id]); // navigate to profile page // view profile
  }
  
}
