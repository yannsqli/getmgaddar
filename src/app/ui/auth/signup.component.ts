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
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';

@Component({
  standalone: true,
  selector: 'mg-signup',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatButtonModule],
  template: `
    <section class="flex w-full h-full justify-center items-center ">
  <form class="w-full md:w-[40%] bg-slate-50" [formGroup]="signUpForm" (ngSubmit)="onSubmit()">
    <section class="p-4 border rounded space-y-4">
    <div class="flex w-full justify-center">
    <p class="font-bebasNeue text-4xl tracking-wide uppercase">Sign Up</p>
  </div>
      <div>
      <mat-form-field class=" w-full">
        <mat-label>Email </mat-label>
        <input matInput
        required
        [formControl]="signUpForm.controls.email"
        placeholder="Ex. pat@example.com"/>
        <mat-error *ngIf="signUpForm.controls.email.hasError('required')"> Email is <strong>required</strong></mat-error>
        <mat-error *ngIf="signUpForm.controls.email.hasError('invalid')"> Email is <strong>invalid</strong></mat-error>
        <mat-error *ngIf="signUpForm.controls.email.hasError('already-in-use')"> Email is <strong>already used</strong></mat-error>
      </mat-form-field>
      <mat-form-field class=" w-full">
        <mat-label>Password </mat-label>
        <input matInput type="password"
          required
          [formControl]="signUpForm.controls.password"
          />
          <mat-error *ngIf="signUpForm.controls.password.hasError('required')"> Password is <strong>required</strong></mat-error>
          <mat-error *ngIf="signUpForm.controls.password.hasError('not-match')"> Passwords do not <strong>match</strong></mat-error>
          <mat-error *ngIf="signUpForm.controls.password.hasError('min')"> Passwords must be at least <strong>6 characters long</strong></mat-error>
      </mat-form-field>
      <mat-form-field class=" w-full">
        <mat-label>Confirm Password </mat-label>
        <input matInput type="password"
          required
          [formControl]="signUpForm.controls.confirmPassword"
          />
          <mat-error *ngIf="signUpForm.controls.password.hasError('required')">Confirm Password is <strong>required</strong></mat-error>
          <mat-error *ngIf="signUpForm.controls.confirmPassword.hasError('not-match')">Passwords do not <strong>match</strong></mat-error>
      </mat-form-field>
  </div>
      <div class="flex w-full justify-center">
        <button mat-raised-button color="primary" class=" w-[80%]" type="submit" [disabled]="!signUpForm.valid">Sign Up</button>
  </div>
    </section>
    </form>
    </section>
  `,
})
export class SignupComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.min(6)]),
  });
  _snackBar = inject(MatSnackBar);
  onSubmit() {
    if (this.signUpForm.value.password != this.signUpForm.value.confirmPassword) {
      this.signUpForm.controls.password.setErrors({ 'not-match': true })
      this.signUpForm.controls.confirmPassword.setErrors({ 'not-match': true })
      return;
    }
    this.authService.signup(this.signUpForm.value.email!, this.signUpForm.value.password!).then(() => {
      this._snackBar.open('Sign Up Successful. Welcome ' + this.authService.currentUser!.email, '', {
        duration: 3000
      });
      this.router.navigate(['/']);
      return;
    }).catch((err: FirebaseError) => {
      if (!err.code) return this.router.navigate(['/']);
      switch (err.code) {
        case 'auth/invalid-credential':
          this.signUpForm.controls.email.setErrors({ 'incorrect': true })
          this.signUpForm.controls.password.setErrors({ 'incorrect': true })
          break;
        case 'auth/email-already-in-use':
          this.signUpForm.controls.email.setErrors({ 'already-in-use': true })
          break;
        case 'auth/weak-password':
          this.signUpForm.controls.password.setErrors({ 'min': true })
          break;
        default:
          this._snackBar.open(`There has been an error in the Sign Up process. (${err.code}) ${err.message}`, 'Dismiss');
          break;
      }
      return
    }
    )
  }
}
