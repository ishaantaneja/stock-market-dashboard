import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Portfolio } from './pages/portfolio/portfolio';
import { Market } from './pages/market/market';
import { Notifications } from './pages/notifications/notifications';
import { Education } from './pages/education/education';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'portfolio', component: Portfolio },
  { path: 'market', component: Market },
  { path: 'notifications', component: Notifications },
  { path: 'education', component: Education },

  // Lazy-load AuthRoutingModule
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth-routing-module').then((m) => m.AuthRoutingModule),
  },
];
