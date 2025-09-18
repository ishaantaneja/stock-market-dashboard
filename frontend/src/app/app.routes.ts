import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Portfolio } from './pages/portfolio/portfolio';
import { Market } from './pages/market/market';
import { Notifications } from './pages/notifications/notifications';
import { Education } from './pages/education/education';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { AuthGuard } from './services/auth.guard';
import { LayoutComponent } from './components/layout/layout';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
      { path: 'portfolio', component: Portfolio, canActivate: [AuthGuard] },
      { path: 'market', component: Market, canActivate: [AuthGuard] },
      { path: 'notifications', component: Notifications, canActivate: [AuthGuard] },
      { path: 'education', component: Education, canActivate: [AuthGuard] },
    ],
  },
];
