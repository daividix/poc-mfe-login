import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {

  }

  login(user: string, password: string) {
    const url = 'https://dummyjson.com/auth/login';
    const body = {
      username: user,
      password
    };
    return this.http.post<any>(url, body);
  }
}
