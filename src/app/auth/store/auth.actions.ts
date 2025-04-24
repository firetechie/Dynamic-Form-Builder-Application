import { createAction, props } from '@ngrx/store';

export const login = createAction(
    '[Auth] Login',
    props<{ username: string; role: 'admin' | 'user' }>()
);

export const logout = createAction('[Auth] Logout');