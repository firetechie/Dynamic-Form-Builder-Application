import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, take, map, of } from "rxjs";
import { Role } from "../models/role.enum";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> {

        return this.authService.currentUser.pipe(
            take(1), // Only take the first emission
            map(user => {
                const requiredRoles = next.data['roles'] as Role[];

                if (!user) {
                    return this.router.createUrlTree(
                        ['/login'],
                        { queryParams: { returnUrl: state.url } }
                    );
                }

                if (requiredRoles && !requiredRoles.includes(user.role)) {
                    return this.router.createUrlTree(['/unauthorized']);
                }

                return true;
            })
        );
    }
}