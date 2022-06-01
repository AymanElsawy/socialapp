import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import io from "socket.io-client";
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];
  socket;

  constructor(private postService: PostService) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
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



}
