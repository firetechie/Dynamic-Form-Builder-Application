import { TestBed } from "@angular/core/testing";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { AuthGuard } from "./auth.guard";

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authService = jasmine.createSpyObj('AuthService', ['currentUserValue']);
        router = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router }
            ]
        });

        guard = TestBed.inject(AuthGuard);
    });

    it('should allow access when user is authenticated', () => {
        authService.currentUserValue = { role: 'user' };
        const route = new ActivatedRouteSnapshot();
        route.data = { roles: ['user'] };

        expect(guard.canActivate(route, {} as RouterStateSnapshot)).toBeTrue();
    });

    it('should redirect to login when user is not authenticated', () => {
        authService.currentUserValue = null;
        const result = guard.canActivate(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot);

        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
});