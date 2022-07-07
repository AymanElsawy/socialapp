import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit, AfterContentInit {
  navContent;
  userId;
  userData;
  posts: any[] = [];
  photoUrl = 'https://res.cloudinary.com/des1acmba/image/upload/v';



  constructor(private route: ActivatedRoute, private userService:UserService) { }

  ngOnInit(): void {
    this.init(); // init nav content and tabs
    this.route.params.subscribe(params => {
      this.userId = params.id; // get user id from url
    });
    this.getUserData(this.userId); // get user data
  }

  init() {
    this.navContent = document.querySelector('.nav-content'); // get nav content
    const tabs = document.querySelectorAll('.tabs'); // get all tabs
    const instance = M.Tabs.init(tabs, {}); // init tabs
  }
  ngAfterContentInit(): void {
    this.navContent.style.display = 'none'; // hide nav content
  }

  getUserData(id) { 
    this.userService.getUser(id).subscribe(data => { // get user data
      this.userData = data['user']; // get user data
      this.posts = data['user']['posts'].reverse(); // get user posts
      console.log(this.posts);
    }, err => {
      console.log(err);
    });
  
  } // get user data
  
  timeAgo(time) {
    return moment(time).fromNow(); // get time from now
  }


}
