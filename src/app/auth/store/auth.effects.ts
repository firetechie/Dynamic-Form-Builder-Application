import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { login } from './auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {

    constructor() { }

    // 1. Use inject() for better tree-shaking
    private actions$ = inject(Actions);
    private router = inject(Router);

    // 2. Use explicit typing and safer initialization
    loginEffect = createEffect(() => {
        return this.actions$.pipe(
            ofType(login),
            tap(() => {
                this.router.navigate(['/forms']);
            })
        );
    }, { dispatch: false });
}