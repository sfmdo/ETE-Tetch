import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { 
  UserProfile, 
  UpdateProfilePayload, 
  UpdateProfileResponse 
} from '../models/user-config.model';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(payload: UpdateProfilePayload): Observable<UpdateProfileResponse> {
    return this.http.patch<UpdateProfileResponse>(`${this.apiUrl}/profile`, payload);
  }
}