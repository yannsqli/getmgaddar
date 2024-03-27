import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LatestIntakeCardComponent } from './components/latestIntakeCard/latestIntakeCard.component';
import { PreviousReportsCardComponent } from './components/previousReportsCard/previousReportsCard.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
  <section class="p-4">
    <div class="flex justify-between">
      <p class="font-bebasNeue text-4xl tracking-wide uppercase">Nutrition Dashboard</p>
      <button mat-raised-button color="primary" [routerLink]="['add']"><mat-icon>add</mat-icon> Add Intake</button>
  </div>
    <div class="flex flex-col md:flex-row w-full md:space-x-4 p-4">
      <span class="basis-1/2 max-h-fit border rounded p-4 bg-slate-50">
        <app-latest-intake-card/>
</span>
    <span class="basis-1/2 border rounded p-4 bg-slate-50">
      <app-previous-reports-card/>
</span>
</div>
  </section>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RouterLink,
    MatButton, MatIconModule,
    LatestIntakeCardComponent,
    PreviousReportsCardComponent
  ]
})
export class DashboardComponent {
}
