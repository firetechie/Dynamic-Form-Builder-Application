import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['username']).toBeDefined();
    expect(component.loginForm.controls['role']).toBeDefined();
  });

  it('should call authService.login on valid form submission', () => {
    component.loginForm.setValue({ username: 'testuser', role: 'admin' });
    component.onSubmit();
    expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'admin');
  });

  it('should not call authService.login on invalid form submission', () => {
    component.loginForm.setValue({ username: '', role: 'admin' });
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});