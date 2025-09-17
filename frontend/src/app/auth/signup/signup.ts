import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
})
export class Signup {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // initialize form here, after fb is available
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      if (!email || !password) return;

      this.authService.signup({ email, password }).subscribe({
        next: (res) => console.log('Signup success:', res),
        error: (err) => console.error('Signup failed:', err),
      });
    }
  }
}
