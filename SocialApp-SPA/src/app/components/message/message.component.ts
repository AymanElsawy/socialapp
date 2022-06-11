import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  receiverId: string; 

  constructor(private route: ActivatedRoute, private userService:UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {  
      this.receiverId = params.id; // get id from url
      this.getReceiverData(); // get user (receiver)
    })
    
  }

  getReceiverData() {
    this.userService.getUser(this.receiverId).subscribe(data => {  // get user from server
      console.log(data);
    }); // subscribe to get user
  } // get user

}
