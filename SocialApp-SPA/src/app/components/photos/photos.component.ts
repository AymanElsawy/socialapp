import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from './../../services/alertify.service';
import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";
@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  socket;
  myEvent: any;
  url: string;
  preloader = false;
  currentUser;
  photos =[];

  constructor(private alertifyService: AlertifyService,
    private userService: UserService,
    private tokenService: TokenService) {
    this.socket = io('http://localhost:3000'); // connect to socket.io server
     }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getPayload(); // get current user
    this.getUserPhotos();
    this.socket.on('refreshPage', () => {   // listen for event from socket.io server
      this.getUserPhotos(); // get user
    })
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

  uploadPhoto() {
    if (this.url) {
      this.preloader = true; // show preloader
      this.userService.uploadPhoto(this.url).subscribe(
        data => {
          this.preloader = false; // hide preloader
          console.log(data);
          this.url = '';
          this.alertifyService.success('Photo uploaded successfully');
          this.socket.emit('refresh', {}); // emit event to socket.io server
        },
        err => {
          this.preloader = false; // hide preloader
          console.log(err);
          this.alertifyService.error("Photo upload failed");
        }
      )
    }

  }

  getUserPhotos() { 
    this.photos = [];
    this.userService.getUser(this.currentUser._id).subscribe(
      data => { 
        this.photos = data['user'].photos; // get photos from user
        
      },
      err => {
        this.alertifyService.error('error in photos');  // show error 
      }
    )
  }
  
  setAsProfile(photo) {
    this.userService.setAsProfile(photo.photoVersion, photo.photoId).subscribe(
      data => {
        this.alertifyService.success('Photo set as profile successfully');
        this.socket.emit('refresh', {}); // emit event to socket.io server
        console.log(data);
      }, err => {
        this.alertifyService.error('error in setting photo as profile');
        console.log(err);
      }
    )
  }
  deletePhoto(photo) {
    this.alertifyService.confirm('Are you sure you want to delete this photo?', () => { 
      this.userService.deletePhoto(photo.photoId).subscribe(
        data => {
          this.alertifyService.success('Photo deleted successfully');
          this.socket.emit('refresh', {}); // emit event to socket.io server
        }, err => {
          this.alertifyService.error('error in deleting photo');
        }
      )
     })
   
  }

}
