import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { UsersComponent } from './dashboard/users/users.component';
import { RoutesComponent } from './dashboard/routes/routes.component';
import { VehiclesComponent } from './dashboard/vehicles/vehicles.component';
import { TripsComponent } from './dashboard/trips/trips.component';
import { DocumentsComponent } from './dashboard/documents/documents.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '',           component: DashboardHomeComponent },
      { path: 'usuarios',  component: UsersComponent },
      { path: 'rotas',     component: RoutesComponent },
      { path: 'veiculos',  component: VehiclesComponent },
      { path: 'viagens',   component: TripsComponent },
      { path: 'documentos',component: DocumentsComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
