import { TokenService } from 'src/app/services/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit {

  token;
  constructor(private tokenService:TokenService) { }

  ngOnInit(): void {
    this.token = this.tokenService.getPayload();
    const tabs = document.querySelectorAll('.tabs');
    const instance = M.Tabs.init(tabs, {});

  }

}
