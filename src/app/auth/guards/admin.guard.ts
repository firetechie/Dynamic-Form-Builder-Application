import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate() {
        return this.authService.isAdmin$.pipe(
            map(isAdmin => {
                if (!isAdmin) {
                    // Redirect to forms list if not admin
                    this.router.navigate(['/forms/list']);
                    return false;
                }
                return true;
            })
        );
    }
}