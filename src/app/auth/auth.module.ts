import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LoginComponent } from './components/login/login.component';
import { AuthEffects } from './store/auth.effects';
import { authReducer } from './store/auth.reducer';
import { AuthService } from './services/auth.service';
import { UnauthorizedComponent } from '../shared/components/unauthorized/unauthorized.component';
import { MaterialModule } from '../core/material.module';

@NgModule({
    declarations: [LoginComponent, UnauthorizedComponent],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forFeature([AuthEffects])
    ],
    providers: [AuthService],
    exports: [LoginComponent]
})
export class AuthModule { }