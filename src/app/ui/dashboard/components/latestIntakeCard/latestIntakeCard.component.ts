import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '@app/auth/auth.service';
import { NutritionReport } from '@app/interfaces/nutrition_report';
import { formatValue } from '@app/lib/utils';
import { DashboardService } from '@app/services/dashboard.service';

@Component({
  selector: 'app-latest-intake-card',
  standalone: true,
  imports: [
    CommonModule, MatLabel, MatProgressBarModule,
  ],
  template: `
<ng-container *ngIf="nutritionReport; else elseTemplate">
<p class="font-bebasNeue text-2xl tracking-wide">Latest intake as of {{currentDate| date:'dd-MM-yyyy'}}</p>
        <div >
          <h1 class=" inline"> <strong>{{nutritionReport.calories}}</strong> </h1> <h2 class=" inline"> calories</h2>
        </div>
        <mat-label>Compromised of: </mat-label>
        <ul>
        <li>
          <mat-progress-bar
            mode="determinate"
            [value]="(this.nutritionReport.protein/this.nutritionReport.calories)*100">
          </mat-progress-bar>
          <mat-label><strong>{{formatValue(this.nutritionReport.protein)}}</strong> kcal of protein</mat-label>
        </li>
        <li>
          <mat-progress-bar
            mode="determinate"
            [value]="(this.nutritionReport.fats/this.nutritionReport.calories)*100">
          </mat-progress-bar>
          <mat-label><strong>{{formatValue(this.nutritionReport.fats)}}</strong> kcal of fats</mat-label>
        </li>
        <li>
          <mat-progress-bar
            mode="determinate"
            [value]="(this.nutritionReport.carbohydrates/this.nutritionReport.calories)*100">
          </mat-progress-bar>
          <mat-label><strong>{{formatValue(this.nutritionReport.carbohydrates)}}</strong> kcal of carbohydrates</mat-label>
        </li>
        <li>
          <mat-progress-bar
            mode="determinate"
            [value]="(this.nutritionReport.fiber/this.nutritionReport.calories)*100">
          </mat-progress-bar>
          <mat-label><strong>{{formatValue(this.nutritionReport.fiber)}}</strong> kcal of fiber</mat-label>
        </li>
        </ul>
</ng-container>
<ng-template #elseTemplate>
<div
  class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
  role="status">
  <span
    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span
  >
</div>
</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LatestIntakeCardComponent implements OnInit {
  formatValue = formatValue
  currentDate = new Date();
  nutritionReport?: NutritionReport;
  dashboardService: DashboardService = inject(DashboardService)
  authService: AuthService = inject(AuthService)
  ngOnInit(): void {
    this.dashboardService.getReports().subscribe((nutritionReports: NutritionReport[]) => {
      let thisNutritionReports = nutritionReports.filter(nutritionReport => nutritionReport.userUuid == this.authService.currentUser!.uid)
      this.nutritionReport = thisNutritionReports[thisNutritionReports.length - 1]
    })
  }
}
