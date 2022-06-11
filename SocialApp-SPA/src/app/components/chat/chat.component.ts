import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit ,AfterViewInit{
  navContent;
  constructor() { }

  ngOnInit(): void {
    this.navContent = document.querySelector('.nav-content'); // get nav content

    
  }
  ngAfterViewInit(): void {
    this.navContent.style.display = 'none'; // hide nav content
  } // hide nav content

}
