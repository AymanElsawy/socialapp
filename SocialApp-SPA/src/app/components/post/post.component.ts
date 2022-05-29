import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  postForm: FormGroup;
  constructor(private fb: FormBuilder, private postService:PostService) { }

  ngOnInit(): void {
    this.init();
  }
  init() {
    this.postForm = this.fb.group({
      post:['',Validators.required]
    })
  }
  addPost() {
    this.postService.addPost(this.postForm.value).subscribe(
      data => {
        console.log(data);
        this.postForm.reset();
       },
      err => {
        console.log(err);
      }
    )
  }

}
