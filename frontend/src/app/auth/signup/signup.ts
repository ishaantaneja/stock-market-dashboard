import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router'; // Import Router
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
})
export class SignupComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { // Inject Router
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.authService.signup({ email, password }).subscribe({
      next: (res) => {
        console.log('Signup success:', res);
        this.router.navigate(['/dashboard']); // Navigate to dashboard on success
      },
      error: (err) => console.error('Signup failed:', err),
    });
  }
}
