import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { map } from 'rxjs';
import { NutritionReport } from './nutrition_report';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCard, MatCardHeader,
    MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
    MatButton, MatLabel, MatProgressBarModule, MatIconModule,
    MatTableModule
  ],
  template: `
  <div class="flex justify-center items-center h-[90vh]">
  <mat-card class="w-[98%] h-[80%]">
    <mat-card-header class="flex justify-between">
      <mat-card-title>Nutrition Dashboard</mat-card-title>
      <button mat-raised-button color="primary" [routerLink]="['add']"><mat-icon>add</mat-icon> Add Intake</button>
    </mat-card-header>
    <mat-card-content class="h-full">
      <div class="flex h-full">
      <span class="flex-1">
    <mat-card >
      <mat-card-header>
        <mat-card-title>Latest intake as of {{currentDate| date:'dd-MM-yyyy'}}</mat-card-title>
        
      </mat-card-header>
      <mat-card-content>
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
          <mat-label>Protein</mat-label>
        </li>
        <li>
          <mat-progress-bar
            mode="determinate"
            [value]="(this.nutritionReport.fats/this.nutritionReport.calories)*100">
          </mat-progress-bar>
          <mat-label>Fats</mat-label>
        </li>
        <li>
          <mat-progress-bar
            mode="determinate"
            [value]="(this.nutritionReport.carbohydrates/this.nutritionReport.calories)*100">
          </mat-progress-bar>
          <mat-label>Carbohydrates</mat-label>
        </li>
        <li>
          <mat-progress-bar
            mode="determinate"
            [value]="(this.nutritionReport.fiber/this.nutritionReport.calories)*100">
          </mat-progress-bar>
          <mat-label>Fiber</mat-label>
        </li>
        </ul>
      </mat-card-content>
    </mat-card>
    </span>
    <span class="flex-1">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Previous Reports</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table #table [dataSource]="dataSource">
            <ng-container matColumnDef="reportDate">
              <th mat-header-cell *matHeaderCellDef> Date </th>
              <td mat-cell *matCellDef="let row"> {{row.reportDate.toDate() | date:'dd-MM-yyyy'}} </td>
            </ng-container>
            <ng-container matColumnDef="calories">
              <th mat-header-cell *matHeaderCellDef> Calories </th>
              <td mat-cell *matCellDef="let row"> {{row.calories}} </td>
            </ng-container>
            <ng-container matColumnDef="protein">
              <th mat-header-cell *matHeaderCellDef> Protein </th>
              <td mat-cell *matCellDef="let row"> {{row.protein}} </td>
            </ng-container>
            <ng-container matColumnDef="carbohydrates">
              <th mat-header-cell *matHeaderCellDef> Carbohydrates </th>
              <td mat-cell *matCellDef="let row"> {{row.carbohydrates}} </td>
            </ng-container>
            <ng-container matColumnDef="fats">
              <th mat-header-cell *matHeaderCellDef> Fats </th>
              <td mat-cell *matCellDef="let row"> {{row.fats}} </td>
            </ng-container>
            <ng-container matColumnDef="fiber">
              <th mat-header-cell *matHeaderCellDef> Fiber </th>
              <td mat-cell *matCellDef="let row"> {{row.fiber}} </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </span>
      </div>
    
    </mat-card-content>
  </mat-card>
  </div>
  `,
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  currentDate = new Date();
  nutritionReport!: NutritionReport;
  displayedColumns: string[] = ['reportDate',
    'calories',
    'carbohydrates',
    'fats',
    'fiber',
    'protein']
  dataSource: NutritionReport[] = []
  constructor(@Inject(DashboardService) private dashboardService: DashboardService, @Inject(AuthService) private authService: AuthService) {
    this.dashboardService.getReports().subscribe((nutritionReports: NutritionReport[]) => {
      let thisNutritionReports = nutritionReports.filter(nutritionReport => nutritionReport.userUuid == authService.currentUser!.uid)
      this.nutritionReport = thisNutritionReports[thisNutritionReports.length - 1]
      this.dataSource = thisNutritionReports
    })
  }
}
