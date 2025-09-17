import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Initialize reactive form here (after fb is available)
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;

      // Extra guard for strict typing
      if (!email || !password) return;

      this.authService.login({ email, password }).subscribe({
        next: (res) => console.log('Login success:', res),
        error: (err) => console.error('Login failed:', err),
      });
    }
  }
}
