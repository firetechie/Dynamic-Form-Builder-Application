import { createReducer, on } from '@ngrx/store';
import { login, logout } from './auth.actions';

export interface AuthState {
    isAuthenticated: boolean;
    user: {
        username: string;
        role: 'admin' | 'user';
    } | null;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    user: null
};

export const authReducer = createReducer(
    initialState,
    on(login, (state, { username, role }) => ({
        ...state,
        isAuthenticated: true,
        user: { username, role }
    })),
    on(logout, (state) => ({
        ...state,
        isAuthenticated: false,
        user: null
    }))
);