import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Create mock objects for dependencies
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      // Provide mocks instead of real services
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        FormBuilder
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty email and password', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
  });

  it('should mark the form as invalid when fields are empty', () => {
    const form = component.form;
    expect(form.invalid).toBeTrue();
  });

  it('should not call authService.login() if the form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call authService.login() and navigate on successful login', () => {
    // Mock a successful API response
    authServiceMock.login.and.returnValue(of({ token: 'mock-jwt-token' }));

    // Set valid form values
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    // Verify that router.navigate was called with the correct path
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should log an error to the console on failed login', () => {
    // Mock a failed API response
    authServiceMock.login.and.returnValue(throwError(() => new Error('Login failed')));
    
    // Create a spy on console.error to check if it's called
    const consoleSpy = spyOn(console, 'error');

    // Set valid form values
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Login failed:', jasmine.any(Object));
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
