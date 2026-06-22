import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { UsersComponent } from './dashboard/users/users.component';
import { RoutesComponent } from './dashboard/routes/routes.component';
import { VehiclesComponent } from './dashboard/vehicles/vehicles.component';
import { TripsComponent } from './dashboard/trips/trips.component';
import { DocumentsComponent } from './dashboard/documents/documents.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { AppAlunoComponent } from './app-aluno/app-aluno.component';
import { AppMotoristaComponent } from './app-motorista/app-motorista.component';

export const routes: Routes = [
  // Auth routes (public)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Root redirects to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Gestor routes (protected)
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['GESTOR'] },
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'relatorios', loadComponent: () => import('./dashboard/relatorios/relatorios.component').then(m => m.RelatoriosComponent) },
      { path: 'usuarios', component: UsersComponent },
      { path: 'rotas', component: RoutesComponent },
      { path: 'veiculos', component: VehiclesComponent },
      { path: 'viagens', component: TripsComponent },
      { path: 'documentos', component: DocumentsComponent },
      { path: 'notificacoes', component: NotificationsComponent },
      { path: 'configuracoes', component: SettingsComponent }
    ]
  },

  // Aluno routes (protected)
  {
    path: 'app/aluno',
    component: AppAlunoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ALUNO'] }
  },

  // Motorista routes (protected)
  {
    path: 'app/motorista',
    component: AppMotoristaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['MOTORISTA'] }
  },

  // Fallback
  { path: '**', redirectTo: '/login' }
];