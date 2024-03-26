import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'mg-signup',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatButtonModule],
  template: `<div class="flex justify-center items-center h-screen">
  <form class="w-full max-w-xs" [formGroup]="signUpForm" (ngSubmit)="onSubmit()">
  <mat-card>
  <mat-card-header>
  <mat-card-title>Sign Up</mat-card-title>
</mat-card-header>
    <mat-card-content>
    <mat-error *ngIf="signUpForm.controls.email.hasError('incorrect') || signUpForm.controls.password.hasError('incorrect')">Incorrect username or password</mat-error>
    <mat-form-field class=" w-full">
      <mat-label>Email </mat-label>
      <input matInput
      required
      [formControl]="signUpForm.controls.email"
      placeholder="Ex. pat@example.com"/>
      <mat-error *ngIf="signUpForm.controls.password.hasError('required')"> Email is <strong>required</strong></mat-error>
    </mat-form-field>
    <mat-form-field class=" w-full">
      <mat-label>Password </mat-label>
      <input matInput type="password"
        required
        [formControl]="signUpForm.controls.password"
        />
        <mat-error *ngIf="signUpForm.controls.password.hasError('required')"> Password is <strong>required</strong></mat-error>
    </mat-form-field>
    </mat-card-content>
    <mat-card-actions class=" justify-center">
      <button mat-raised-button color="primary" class=" w-[80%]" type="submit" [disabled]="!signUpForm.valid">Signup</button>
    </mat-card-actions>
  </mat-card>
  </form>
</div>`,
})
export class SignupComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  _snackBar = inject(MatSnackBar);
  onSubmit() {
    this.authService.signup(this.signUpForm.value.email!, this.signUpForm.value.password!).then(() => {
      this._snackBar.open('Sign Up Successful. Welcome ' + this.authService.currentUser!.email, '', {
        duration: 3000
      });
      this.router.navigate(['/']);
      return;
    }).catch((err: FirebaseError) => {
      if (err.code == 'auth/invalid-credential') {
        this.signUpForm.controls.email.setErrors({ 'incorrect': true })
        this.signUpForm.controls.password.setErrors({ 'incorrect': true })
      }
      else {
        this._snackBar.open(`There has been an error in the Sign Up process. (${err.code}) ${err.message}`, 'Dismiss');
      }
    }
    )
  }
}
