import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseError } from '@angular/fire/app';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@app/auth/auth.service';



@Component({
  selector: 'mg-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatButtonModule, MatTooltipModule],
  template: `
  <div class="text-center">
    <p class="font-passionOne text-4xl uppercase">Get swol, get good, get mgaddar</p>
  </div>

    <section class="flex w-full h-full justify-center items-center ">
  <form class="w-full md:w-[40%] bg-slate-50" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <section class="p-4 border rounded space-y-4">
    <div class="flex w-full justify-center">
    <p class="font-bebasNeue text-4xl tracking-wide uppercase">Login</p>
  </div>
      <div>
        <div class="flex w-full justify-center">
          <mat-error *ngIf="loginForm.controls.email.hasError('incorrect') || loginForm.controls.password.hasError('incorrect')">Incorrect username or password</mat-error>
        </div>
      <mat-form-field class=" w-full">
        <mat-label>Email </mat-label>
        <input matInput
        required
        [formControl]="loginForm.controls.email"
        placeholder="Ex. pat@example.com"/>
        <mat-error *ngIf="loginForm.controls.email.hasError('required')"> Email is <strong>required</strong></mat-error>
        <mat-error *ngIf="loginForm.controls.email.hasError('invalid')"> Email is <strong>invalid</strong></mat-error>
      </mat-form-field>
      <mat-form-field class=" w-full">
        <mat-label>Password </mat-label>
        <input matInput type="password"
          required
          [formControl]="loginForm.controls.password"
          />
          <mat-error *ngIf="loginForm.controls.password.hasError('required')"> Password is <strong>required</strong></mat-error>
      </mat-form-field>
      <button class="underline" matTooltip="Too bad!">Forgot your password ?</button>
  </div>
      <div class="flex w-full justify-center">
        <button mat-raised-button color="primary" class=" w-[80%]" type="submit" [disabled]="!loginForm.valid">Login</button>
  </div>
      <div class="flex w-full items-center justify-center pb-2">
        <a class="underline" [routerLink]="['/auth/signup']">New to the site? Sign up</a>
  </div>
    </section>
    </form>
    </section>
  `,
})

export class LoginComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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
