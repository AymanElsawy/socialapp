import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private postService: PostService) { }

  ngOnInit(): void {
    this.navContent = document.querySelector('.nav-content');
    this.init();
    this.route.params.subscribe(params => {
      this.postId = params.id; // get post id from url
    });
    this.getAllComments(); // get all comments on page load
  }
  ngAfterViewInit(): void {
    this.navContent.style.display = 'none'; // hide nav content
  }

  init() {
    this.commentFrom = this.fb.group({
      comment: ['', Validators.required],   // comment form  

    }); 
  } // init comment form

  addComment() {
    this.postService.addComment(this.postId, this.commentFrom.value.comment).subscribe(data => {
      this.commentFrom.reset(); // reset comment form
    });
  }

  getAllComments() {
    this.postService.getPostComments(this.postId).subscribe(data => {
      console.log(data);
      this.comments = data.post.comments; // get all comments
      this.post = data.post; // get post data
    });
  } // get all comments
  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  }

}
