import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { formatValue } from '../../../../lib/utils';
import * as d3 from "d3";
import { NutritionReport } from '../../../../interfaces/nutrition_report';
import { AuthService } from '../../../../auth/auth.service';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
  selector: 'app-previous-reports-card',
  standalone: true,
  imports: [
    CommonModule, MatLabel, MatProgressBarModule, MatTableModule, MatDividerModule, NgxChartsModule,
  ],
  template: `
<ng-container *ngIf="dataSource; else elseTemplate">
<p class="font-bebasNeue text-2xl tracking-wide">Previous Reports</p>
        <ngx-charts-line-chart class="hidden md:block"
  [view]="[700, 300]"
  [curve]="d3.curveNatural"
  [showGridLines]="false"
  [showXAxisLabel]="false"
  [showYAxisLabel]="true"
  [yAxisLabel]="yAxisLabel"
  [xAxis]="true"
  [yAxis]="true"
  [timeline]="true"
  [results]="data"
  >
</ngx-charts-line-chart>
<mat-divider></mat-divider>
          <table mat-table #table [dataSource]="dataSource">
            <ng-container matColumnDef="reportDate">
              <th mat-header-cell *matHeaderCellDef> Date </th>
              <td mat-cell *matCellDef="let row"> {{row.reportDate.toDate() | date:'dd-MM-yyyy'}} </td>
            </ng-container>
            <ng-container matColumnDef="calories">
              <th mat-header-cell *matHeaderCellDef> Calories </th>
              <td mat-cell *matCellDef="let row"> {{formatValue(row.calories)}} </td>
            </ng-container>
            <ng-container matColumnDef="protein">
              <th mat-header-cell *matHeaderCellDef> Protein </th>
              <td mat-cell *matCellDef="let row"> {{formatValue(row.protein)}} </td>
            </ng-container>
            <ng-container matColumnDef="carbohydrates">
              <th mat-header-cell *matHeaderCellDef> Carbohydrates </th>
              <td mat-cell *matCellDef="let row"> {{formatValue(row.carbohydrates)}} </td>
            </ng-container>
            <ng-container matColumnDef="fats">
              <th mat-header-cell *matHeaderCellDef> Fats </th>
              <td mat-cell *matCellDef="let row"> {{formatValue(row.fats)}} </td>
            </ng-container>
            <ng-container matColumnDef="fiber">
              <th mat-header-cell *matHeaderCellDef> Fiber </th>
              <td mat-cell *matCellDef="let row"> {{formatValue(row.fiber)}} </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
</ng-container>
<ng-template #elseTemplate>
  Loading
</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PreviousReportsCardComponent implements OnInit {
  dashboardService: DashboardService = inject(DashboardService)
  authService: AuthService = inject(AuthService)

  formatValue = formatValue
  data: any = []
  displayedColumns: string[] = ['reportDate',
    'calories',
    'carbohydrates',
    'fats',
    'fiber',
    'protein']
  dataSource?: NutritionReport[]
  yAxisLabel = "Calories"
  d3 = d3;

  ngOnInit(): void {
    this.dashboardService.getReports().subscribe((nutritionReports: NutritionReport[]) => {
      let thisNutritionReports = nutritionReports.filter(nutritionReport => nutritionReport.userUuid == this.authService.currentUser!.uid)
      this.dataSource = thisNutritionReports
      this.data = [
        {
          name: "Calories",
          series:
            this.dataSource.map((nutritionReport: NutritionReport) => {
              return {
                name: nutritionReport.reportDate.toDate().toLocaleString(),
                value: nutritionReport.calories
              }
            })
        },
        {
          "name": "null",
          "series": [
          ]
        }
      ]
    })
  }
}
