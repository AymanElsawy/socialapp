import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { TokenService } from 'src/app/services/token.service';
import * as moment from 'moment';
import io from "socket.io-client";
import _ from 'lodash';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  topPosts = [];
  socket;
  user;
  photoUrl = 'https://res.cloudinary.com/des1acmba/image/upload/v';

  constructor(private postService: PostService, private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
    this.user = this.tokenService.getPayload(); // get user data
    this.getTopPosts(); // get all posts on page load
    this.socket.on('refreshPage', () => {
      this.getTopPosts(); // get posts from server on refresh event
    }); // listen for event from socket.io server
  }

  getTopPosts() {
    this.postService.getAllPosts().subscribe(data => {
      
      this.topPosts = data.topPosts;
    });
  } // get all posts from server

  likePost(post) {

    this.postService.addLike(post).subscribe(data => {
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
