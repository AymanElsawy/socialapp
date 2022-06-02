import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }
  
  addPost(post):Observable<any> {
    return this.http.post(`${environment.api}/post/add-post`, post); // post post to server
  }
  getAllPosts():Observable<any> {
    return this.http.get(`${environment.api}/post/get-all-posts`); // get all posts from server
  }
  addLike(postId):Observable<any> {
    return this.http.post(`${environment.api}/post/like-post`,postId); // like post on server
  }
  addComment(postId,comment):Observable<any> {
    return this.http.post(`${environment.api}/post/comment-post`,{postId,comment}); // comment post on server
  }
  getPostComments(postId):Observable<any> {
    return this.http.get(`${environment.api}/post/${postId}`); // get post comments on server
  }
  
}
