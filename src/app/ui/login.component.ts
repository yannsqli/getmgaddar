import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseError } from '@angular/fire/app';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'mg-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatButtonModule, MatTooltipModule],
  template: `<div class="flex justify-center items-center h-screen">
    <form class="w-full max-w-xs" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <mat-card>
    <mat-card-header>
    <mat-card-title>Login</mat-card-title>
  </mat-card-header>
      <mat-card-content>
      <mat-error *ngIf="loginForm.controls.email.hasError('incorrect') || loginForm.controls.password.hasError('incorrect')">Incorrect username or password</mat-error>
      <mat-form-field class=" w-full">
        <mat-label>Email </mat-label>
        <input matInput
        required
        [formControl]="loginForm.controls.email"
        placeholder="Ex. pat@example.com"/>
        <mat-error *ngIf="loginForm.controls.password.hasError('required')"> Email is <strong>required</strong></mat-error>
      </mat-form-field>
      <mat-form-field class=" w-full">
        <mat-label>Password </mat-label>
        <input matInput type="password"
          required
          [formControl]="loginForm.controls.password"
          />
          <mat-error *ngIf="loginForm.controls.password.hasError('required')"> Password is <strong>required</strong></mat-error>
      </mat-form-field>
      <button matTooltip="Too bad!">Forgot your password ?</button>
      </mat-card-content>
      <mat-card-actions class=" justify-center">
        <button mat-raised-button color="primary" class=" w-[80%]" type="submit" [disabled]="!loginForm.valid">Login</button>
      </mat-card-actions>
      <mat-card-footer class="flex w-full items-center justify-center pb-2">
        <a [routerLink]="['/auth/signup']">New to the site? Sign up</a>
      </mat-card-footer>
    </mat-card>
    </form>
  </div>`,
})

export class LoginComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  _snackBar = inject(MatSnackBar);
  onSubmit() {
    this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!).then((userCredential) => {
      this._snackBar.open('Welcome ' + userCredential.user.email, '', {
        duration: 3000
      });
      this.router.navigate(['/']);
      return;
    }).catch((err: FirebaseError) => {
      if (err.code == 'auth/invalid-credential') {
        this.loginForm.controls.email.setErrors({ 'incorrect': true })
        this.loginForm.controls.password.setErrors({ 'incorrect': true })
      }
      else
        console.error(err.code, err.cause, err.message);
    }
    )
  }
}
