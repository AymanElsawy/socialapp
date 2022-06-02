import { Router } from '@angular/router';
import { TokenService } from './../../services/token.service';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import io from "socket.io-client";
import _ from 'lodash';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];
  socket;
  user;

  constructor(private postService: PostService, private tokenService:TokenService , private router:Router) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
    this.user = this.tokenService.getPayload(); // get user data
    this.getPosts(); // get all posts on page load
    this.socket.on('refreshPage', () => {
      this.getPosts() ; // get posts from server on refresh event
    }); // listen for event from socket.io server
  }

  getPosts() {
    this.postService.getAllPosts().subscribe(data => {
      console.log(data);
      this.posts = data.posts;
    });
  } // get all posts from server

  likePost(post) {
   
    this.postService.addLike(post).subscribe(data => {  
      console.log(data);
      this.socket.emit('refresh',{message:'refresh page'}); // emit event to refresh page
    })
  } // like post

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  }

  areYouLike(arr,username){
    return _.some(arr, { username: username }); // check if user has liked post
  } 

  goToComments(post) {
    this.router.navigate(['post', post._id]); // navigate to comments page
  }



}
