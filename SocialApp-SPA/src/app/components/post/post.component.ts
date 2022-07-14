import { AlertifyService } from './../../services/alertify.service';
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
  myEvent: any;
  url: string;
  preloader = false;
  constructor(private fb: FormBuilder,
    private postService: PostService,
    private tokenService: TokenService,
    private alertifyService: AlertifyService) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
  }

  ngOnInit(): void {
    this.init(); // initialize form 
    this.currentUser = this.tokenService.getPayload(); // get user data
  }
  init() {
    this.postForm = this.fb.group({
      post: ['', Validators.required] // post field with validators
    })
  }
  addPost() {
    let body; // post body
    if (!this.url) { // if no image
      body = {
        post: this.postForm.value.post, // get post value
      }
    } else { // if image
      body = {
        post: this.postForm.value.post, // get post value
        photo: this.url // get image url
      }
    }
    if (this.postForm.value.post) {
      this.preloader = true; // show preloader
      this.postService.addPost(body).subscribe(
        data => {
          this.preloader = false; // hide preloader
          console.log(data);
          this.socket.emit('refresh', { message: 'refresh page' }); // emit event to refresh page
          this.postForm.reset(); // reset form
          this.url = ''; // clear image url

        },
        err => {
          console.log(err);  // error handling
          this.preloader = false; // hide preloader
          this.alertifyService.error(err.error.message); // show error message
          this.url = ''; // clear image url
        }
      )
    } else {
      this.alertifyService.warning('please write something'); // show warning message
    }
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => {
        if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) { // check if it is an image
          this.alertifyService.warning('image should be JPG|JPEG|PNG|GIF'); // if not image, show error
          this.url = ''; // clear image url
          this.clearFilePath(); // clear file path
        }
        else {
          if (event.target.files[0].size > 3 * 1024 * 1024) { // check if it is not too big
            this.alertifyService.warning('image should not be more than 1.5mb'); // if too big, show error
            this.url = ''; // clear image url
            this.clearFilePath(); // clear file path
          } else {
            this.url = reader.result as string; // set image url
            this.myEvent = event; // set event as myEvent
            this.clearFilePath(); // clear file path
          }
        }
      }
    }
  }

  clearFilePath() {
    const filePath = <HTMLInputElement>document.getElementById('upload'); // get file path
    filePath.value = ''; // clear file path
  }
}
