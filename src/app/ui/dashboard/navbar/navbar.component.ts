import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule
  ],
  template: `
  <nav>
        <mat-toolbar class="flex justify-between">
            <a class="font-passionOne uppercase italic" [routerLink]="[ '/']">{{title}}</a>
            <div *ngIf="authService.currentUser">
                <button mat-button [matMenuTriggerFor]="menu">
                    {{authService.currentUser.email}}
                </button>
                <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="signOut()">Sign Out</button>
                </mat-menu>
                <button mat-button disabled>
                    <mat-icon fontIcon="account_circle"></mat-icon>
                </button>
            </div>
        </mat-toolbar>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  @Input() title = 'GetMGAddar';
  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/']);
    })
  }

}
