import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import io from 'socket.io-client';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {

  navContent;
  commentFrom: FormGroup;
  postId:string;
  post;
  comments;
  p: number = 1;
  socket;
  socketHost;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private postService: PostService) { 
    this.socketHost = 'http://localhost:3000'; // set socket host
    this.socket = io(this.socketHost);  // connect to socket
  }

  ngOnInit(): void {
    this.navContent = document.querySelector('.nav-content'); // get nav content
    this.init(); // init comment form
    this.route.params.subscribe(params => {
      this.postId = params.id; // get post id from url
    });
    this.getAllComments(); // get all comments on page load
    this.socket.on('refreshPage', () => {  
      this.getAllComments(); // get all comments on comment added
    })
  }

  ngAfterViewInit(): void {
    this.navContent.style.display = 'none'; // hide nav content
  } // hide nav content

  init() {
    this.commentFrom = this.fb.group({
      comment: ['', Validators.required],   // comment form  

    }); 
  } // init comment form

  addComment() {
    this.postService.addComment(this.postId, this.commentFrom.value.comment).subscribe(data => {
      this.socket.emit('refresh', {}); // emit refresh event to all connected sockets
      this.commentFrom.reset(); // reset comment form
    });
  } // add comment  

  getAllComments() {
    this.postService.getPostComments(this.postId).subscribe(data => {
      console.log(data);
      this.comments = data.post.comments; // get all comments
      this.post = data.post; // get post data
    });
  } // get all comments

  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  } // get time from now

}
