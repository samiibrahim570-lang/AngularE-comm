import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

  export interface AuthResponse {
    token: string;
    role: string;
    userId: number;
    fullName: string;
    email: string;
  }

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  whatsAppNumber: string;
  address: string;
}

export interface GuestUserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  whatsAppNumber: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.currentUserSubject.next(userData);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
        .subscribe({
          next: (response) => {
            this.setCurrentUser(response);
            observer.next(response);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
    });
  }

  signup(userData: SignupRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      fullName: userData.fullName,
      email: userData.email,
      passwordHash: userData.password,
      phoneNumber: userData.phoneNumber,
      whatsAppNumber: userData.whatsAppNumber,
      address: userData.address,
      role: 'Customer'
    });
  }

  setCurrentUser(user: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  registerGuestUser(guestData: GuestUserData): Observable<AuthResponse> {
    const signupData: SignupRequest = {
      fullName: guestData.fullName,
      email: guestData.email,
      password: 'guest-' + Date.now(),
      phoneNumber: guestData.phoneNumber,
      whatsAppNumber: guestData.whatsAppNumber,
      address: guestData.address
    };

    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/register`, {
        fullName: signupData.fullName,
        email: signupData.email,
        passwordHash: signupData.password,
        phoneNumber: signupData.phoneNumber,
        whatsAppNumber: signupData.whatsAppNumber,
        address: signupData.address,
        role: 'Guest'
      }).subscribe({
        next: (response) => {
          const authResponse: AuthResponse = {
            token: response.token || 'guest-' + Date.now(),
            role: 'Guest',
            userId: response.userId || response.id || 0,
            fullName: guestData.fullName,
            email: guestData.email
          };
          this.setCurrentUser(authResponse);
          localStorage.setItem('guestUserData', JSON.stringify(guestData));
          observer.next(authResponse);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  setGuestUser(guestData: GuestUserData): void {
    const guestUser: AuthResponse = {
      token: 'guest-' + Date.now(),
      role: 'Guest',
      userId: 0,
      fullName: guestData.fullName,
      email: guestData.email
    };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.setItem('guestUserData', JSON.stringify(guestData));
    this.currentUserSubject.next(guestUser);
    this.isAuthenticatedSubject.next(true);
  }

  getGuestUserData(): GuestUserData | null {
    const data = localStorage.getItem('guestUserData');
    return data ? JSON.parse(data) : null;
    // this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getGuestUserFromStorage(): AuthResponse | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'Guest' && userData.userId && userData.userId > 0) {
        return userData;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  updateProfile(userId: number, profileData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-profile/${userId}`, profileData);
  }
}
