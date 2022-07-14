import { TokenService } from './../../services/token.service';
import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import io from "socket.io-client";
import _ from 'lodash';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit, AfterContentInit {
  navContent;
  userId;
  userData; // profile user data 
  posts: any[] = [];
  photoUrl = 'https://res.cloudinary.com/des1acmba/image/upload/v';
  socket;
  currentUser;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private tokenService:TokenService
  
  ) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
   }

  ngOnInit(): void {
    this.init(); // init nav content and tabs
    this.currentUser = this.tokenService.getPayload(); // get user data
    this.route.params.subscribe(params => {
      this.userId = params.id; // get user id from url
    });
    this.getUserData(this.userId); // get user data
    this.socket.on('refreshPage', () => {  
      this.getUserData(this.userId); // get user data on refresh event
    })
  }

  init() {
    this.navContent = document.querySelector('.nav-content'); // get nav content
    const tabs = document.querySelectorAll('.tabs'); // get all tabs
    const instance = M.Tabs.init(tabs, {}); // init tabs
  }
  ngAfterContentInit(): void {
    this.navContent.style.display = 'none'; // hide nav content
  }

  getUserData(id) { 
    this.userService.getUser(id).subscribe(data => { // get user data
      this.userData = data['user']; // get user data
      this.posts = data['user']['posts'].reverse(); // get user posts
      console.log(this.posts);
    }, err => {
      console.log(err);
    });
  
  } // get user data
  

  likePost(post) {

    this.postService.addLike(post.postId).subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page
    })
  } // like post

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  }

  areYouLike(arr, username) {
    return _.some(arr, { username: username }); // check if user has liked post
  }

  goToComments(post) {
    this.router.navigate(['post', post._id]); // navigate to comments page
  }



}
