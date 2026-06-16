import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Route } from '../models/dashboard.model';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit {
  private svc = inject(DashboardService);

  routes: Route[] = [];
  filtered: Route[] = [];
  search: string = '';
  filterStatus: string = 'Todas';

  totalRoutes = 0;
  activeRoutes = 0;
  totalDistance = '';
  totalCapacity = 0;

  ngOnInit() {
    this.svc.getRoutes().subscribe(data => {
      this.routes = data;
      this.filtered = data;
      this.totalRoutes = data.length;
      this.activeRoutes = data.filter(r => r.status === 'Ativa').length;
      this.totalCapacity = data.reduce((acc, r) => acc + r.capacity, 0);
      // Sum distances (strip ' km')
      const totalKm = data.reduce((acc, r) => acc + parseFloat(r.distance), 0);
      this.totalDistance = totalKm.toFixed(1) + ' km';
    });
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onStatusChange(event: Event) {
    this.filterStatus = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters() {
    this.filtered = this.routes.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = this.filterStatus === 'Todas' || r.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }
}
