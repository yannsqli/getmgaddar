import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './ui/auth/login.component';
import { SignupComponent } from './ui/auth/signup.component';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { DashboardAddComponent } from './ui/dashboard/dashboard-add/dashboard-add.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AppComponent,
        canActivate: [authGuard],
    },
    {
        path: 'auth/login',
        component: LoginComponent,
    },
    { path: 'auth/signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'dashboard/add', component: DashboardAddComponent }
];
