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

  getAllMessages(senderId, receiverId) {
    return this.http.get(`${environment.api}/chat/${senderId}/${receiverId}`); // get all messages from server
  }

  markMessages(senderId, receiverId) {
    return this.http.get(`${environment.api}/receiver-messages/${senderId}/${receiverId}`); // mark messages as read
  }
  markAllMessages() {
    return this.http.get(`${environment.api}/mark-all-messages/`); // mark all messages as read
  }
}
