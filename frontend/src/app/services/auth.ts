import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthRes {
  token: string;
  refreshToken: string;
  user: { id: number; email: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:4000/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthRes> {
    return this.http.post<AuthRes>(`${this.base}/login`, credentials)
      .pipe(tap(res => this.storeTokens(res.token, res.refreshToken)));
  }

  signup(credentials: { email: string; password: string }): Observable<AuthRes> {
    return this.http.post<AuthRes>(`${this.base}/signup`, credentials)
      .pipe(tap(res => this.storeTokens(res.token, res.refreshToken)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    // naive JWT expiry check (for demo)
    return !!token;
  }

  private storeTokens(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
