import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { Router, RouterLink } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@app/auth/auth.service';
import { NutritionReport } from '@app/interfaces/nutrition_report';
import { formatValue } from '@app/lib/utils';
import { DashboardService } from '@app/services/dashboard.service';

@Component({
  selector: 'app-dashboard-add',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatButtonModule, MatIconModule, MatSliderModule
  ],
  template: `
  <section class="flex w-full h-full justify-center items-center ">
  <form class="w-full md:w-[50%] bg-slate-50" [formGroup]="nutritionForm" (ngSubmit)="onSubmit()">
  <section class="p-4 border rounded">
  <div class="flex w-full justify-center">
  <p class="font-bebasNeue text-4xl tracking-wide uppercase">Add Intake</p>
</div>
    <div>
      <span class="flex justify-center space-x-4">
      <mat-form-field class=" w-full max-w-xs justify-center align-middle">
        <input matInput
        type="number"
        min="0"
        placeholder="Ex. 200"
        required
        [formControl]="nutritionForm.controls.calories"
        />
        <mat-error *ngIf="nutritionForm.controls.calories.hasError('required')"> Calories are <strong>required</strong></mat-error>
      </mat-form-field>
      <h1>kcal</h1>
    </span>
    <ul>
      <li class="flex flex-col">
      <mat-label>Protein </mat-label>
      <span class="flex w-full">
        <mat-slider min="0" max="1" step="0.1" class="basis-4/5">
          <input matSliderThumb [formControl]="nutritionForm.controls.protein">
        </mat-slider>
        <p><strong>{{formatValue(nutritionForm. value.protein!*nutritionForm.value.calories!)}}</strong> kcal</p>
      </span>
      </li>
      <li class="flex flex-col">
        <mat-label>Carbohydrates</mat-label>
        <span class="flex w-full">
          <mat-slider min="0" max="1" step="0.1" class="basis-4/5">
            <input matSliderThumb [formControl]="nutritionForm.controls.carbohydrates">
          </mat-slider>
          <p><strong>{{formatValue(nutritionForm. value.carbohydrates!*nutritionForm.value.calories!)}}</strong> kcal</p>
        </span>
      </li>
      <li class="flex flex-col">
        <mat-label>Fats</mat-label>
        <span class="flex w-full">
          <mat-slider min="0" max="1" step="0.1" class="basis-4/5">
            <input matSliderThumb [formControl]="nutritionForm.controls.fats">
          </mat-slider>
          <p><strong>{{formatValue(nutritionForm. value.fats!*nutritionForm.value.calories!)}}</strong> kcal</p>
        </span>
      </li>
      <li class="flex flex-col">
        <mat-label>Fiber</mat-label>
        <span class="flex w-full">
          <mat-slider min="0" max="1" step="0.1" class="basis-4/5">
            <input matSliderThumb [formControl]="nutritionForm.controls.fiber">
          </mat-slider>
          <p><strong>{{formatValue(nutritionForm.value.fiber!*nutritionForm.value.calories!)}}</strong> kcal</p>
        </span>
      </li>
    </ul>
</div>
    <div class="flex w-full justify-center">
      <button mat-raised-button color="primary" class=" w-[80%]" type="submit" [disabled]="!nutritionForm.valid || nutritionForm.value.calories == 0"><mat-icon>add</mat-icon> Add</button>
</div>
  </section>
  </form>
  </section>
  
`,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardAddComponent {
  router: Router = inject(Router);
  nutritionForm = new FormGroup({
    calories: new FormControl(0, [Validators.required]),
    carbohydrates: new FormControl(0, [Validators.required]),
    fats: new FormControl(0, [Validators.required]),
    fiber: new FormControl(0, [Validators.required]),
    protein: new FormControl(0, [Validators.required]),
  })
  dashboardService: DashboardService = inject(DashboardService)
  authService: AuthService = inject(AuthService)
  _snackBar = inject(MatSnackBar);
  formatValue = formatValue;

  onSubmit() {
    if (this.nutritionForm.value.calories == 0)
      return this.nutritionForm.controls.calories.setErrors({ 'required': true })
    this.dashboardService.addReport(<NutritionReport>{
      userUuid: this.authService.currentUser!.uid,
      reportDate: Timestamp.now(),
      calories: this.nutritionForm.value.calories!,
      protein: this.nutritionForm.value.protein! * this.nutritionForm.value.calories!,
      carbohydrates: this.nutritionForm.value.carbohydrates! * this.nutritionForm.value.calories!,
      fats: this.nutritionForm.value.fats! * this.nutritionForm.value.calories!,
      fiber: this.nutritionForm.value.fiber! * this.nutritionForm.value.calories!
    })
      .then(() => {
        this._snackBar.open('Intake added successfully', 'Dismiss')
        this.router.navigate(['/dashboard'])
      })
      .catch(err => this._snackBar.open(`There has been an error in the Add process. (${err.code}) ${err.message}`, 'Dismiss'))
  }
}
