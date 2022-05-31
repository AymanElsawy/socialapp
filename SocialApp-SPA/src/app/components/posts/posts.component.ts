import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts=[];

  constructor(private postService:PostService) { }

  ngOnInit(): void {
    this.getPosts()
  }

  getPosts() {
    this.postService.getAllPosts().subscribe(data => {
      console.log(data);
      this.posts = data.posts;
    });
  }

  timeAgo(time) {
    return moment(time).fromNow();
  }

  

}
