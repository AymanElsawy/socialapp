import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from './../../services/alertify.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  myEvent: any;
  url: string;

  constructor(private alertifyService: AlertifyService, private userService: UserService) { }

  ngOnInit(): void {
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
          if (event.target.files[0].size > 1.5 * 1024 * 1024) { // check if it is not too big
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
    console.log(this.url);
    if (this.url) {
      this.userService.uploadPhoto(this.url).subscribe(
        data => {
          console.log(data);
          this.url = '';
          this.alertifyService.success('Photo uploaded successfully');
         },
        err => {
          console.log(err);
          this.alertifyService.error("Photo upload failed");
        }
      )
    }
    
  }

}
