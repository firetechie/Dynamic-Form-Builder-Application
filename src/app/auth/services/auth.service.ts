import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Initialize isAuthenticated$ based on currentUser
    this.isAuthenticated$ = this.currentUser.pipe(
      map(user => !!user) // Convert user object to boolean
    );
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, role: string): Observable<any> {  // Remove password parameter
    const user = {
      username,
      role,
      token: 'mock-jwt-token'
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);

    // Navigation based on role
    this.router.navigate([role === 'admin' ? '/admin' : '/user']);
    return of(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}