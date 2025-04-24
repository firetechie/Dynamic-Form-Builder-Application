import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        return this.authService.isAuthenticated$.pipe(
            map(isAuthenticated => {
                if (isAuthenticated) {
                    this.router.navigate(['/forms/list']);
                    return false;
                }
                return true;
            })
        );
    }
}