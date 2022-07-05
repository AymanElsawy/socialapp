import { TokenService } from 'src/app/services/token.service';
import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  postForm: FormGroup;
  socket;
  currentUser;
  constructor(private fb: FormBuilder, private postService: PostService, private tokenService:TokenService) { 
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
    this.init(); // initialize form 
    this.currentUser = this.tokenService.getPayload(); // get user data
  }
  init() {
    this.postForm = this.fb.group({
      post:['',Validators.required] // post field with validators
    })
  }
  addPost() {
    this.postService.addPost(this.postForm.value).subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh',{message:'refresh page'}); // emit event to refresh page
        this.postForm.reset(); // reset form
        
       },
      err => {
        console.log(err);  // error handling
      }
    )
  }

}
