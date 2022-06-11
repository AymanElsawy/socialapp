import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(senderId, receiverId, receiverName, message) {
    return this.http.post(`${environment.api}/chat/${senderId}/${receiverId}`,
      {
        receiverId,
        receiverName,
        message
      }); // send message to server
  }
}
