import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  
  addUser(body): Observable<any>{
    return this.http.post(`${environment.api}/register`,body)
  }
  loginUser(body): Observable<any>{
    return this.http.post(`${environment.api}/login`,body)
  }
}
