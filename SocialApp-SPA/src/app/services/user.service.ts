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
    return this.http.post(`${environment.api}/follow-user`, { userfollowed: userfollowed }); // follow user 
  }; // follow user 
  unfollowUser(userfollowed) {
    return this.http.post(`${environment.api}/unfollow-user`, { userfollowed: userfollowed }); // unfollow user 
  }; // unfollow user 

  markAsReadOrDelete(id, deleteIt?) {
    return this.http.post(`${environment.api}/mark/${id}`, { id, deleteIt }); // mark as read or delete 
  } // mark as read or delete

  markAllAsRead() {
    return this.http.post(`${environment.api}/mark-all`, {}); // mark all as read 
  }// mark all as read 

  uploadPhoto(photo) {
    return this.http.post(`${environment.api}/upload-photo`, { photo: photo }); // upload photo 
  } // upload photo

  setAsProfile(photoVersion,photoId) {
    return this.http.get(`${environment.api}/set-as-profile/${photoVersion}/${photoId}`); // set as profile 
   // set as profile
  }

}



