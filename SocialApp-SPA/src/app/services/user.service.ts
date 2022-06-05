import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getAllUsers() {
    return this.http.get(`${environment.api}/all-users`); // get all users from server
  }; // get all users from server
  getUser(id) {
    return this.http.get(`${environment.api}/user/${id}`); // get user from server
  }; // get user from server
  followUser(userfollowed) {
    return this.http.post(`${environment.api}/follow-user`, { userfollowed: userfollowed}); // follow user 
  }; // follow user 
  unfollowUser(userfollowed) {
    return this.http.post(`${environment.api}/unfollow-user`, { userfollowed: userfollowed}); // unfollow user 
  }; // unfollow user 
}



