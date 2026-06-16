import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { SearchService } from '../services/search.service';
import { Route, RouteStop } from '../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit, OnDestroy {
  private svc = inject(DashboardService);
  private searchSvc = inject(SearchService);

  routes: Route[] = [];
  filtered: Route[] = [];
  search: string = '';
  filterStatus: string = 'Todas';

  totalRoutes = 0;
  activeRoutes = 0;
  totalDistance = '';
  totalCapacity = 0;

  // Modal Control
  showCreateModal = false;
  newRoute = {
    name: '',
    description: '',
    originDest: '',
    distance: '',
    time: '',
    capacity: 40,
    status: 'Ativa' as Route['status'],
    stops: [] as RouteStop[]
  };

  newStopName = '';
  newStopTime = '';

  private sub = new Subscription();

  ngOnInit() {
    this.sub.add(
      this.svc.getRoutes().subscribe(data => {
        this.routes = data;
        this.totalRoutes = data.length;
        this.activeRoutes = data.filter(r => r.status === 'Ativa').length;
        this.totalCapacity = data.reduce((acc, r) => acc + r.capacity, 0);
        const totalKm = data.reduce((acc, r) => acc + parseFloat(r.distance || '0'), 0);
        this.totalDistance = totalKm.toFixed(1) + ' km';
        this.applyFilters();
      })
    );

    this.sub.add(
      this.searchSvc.searchQuery$.subscribe(query => {
        this.search = query;
        this.applyFilters();
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchSvc.setSearchQuery(val);
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

  openCreateModal() {
    this.showCreateModal = true;
    this.newRoute = {
      name: '',
      description: '',
      originDest: '',
      distance: '',
      time: '',
      capacity: 40,
      status: 'Ativa',
      stops: []
    };
    this.newStopName = '';
    this.newStopTime = '';
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  addStop() {
    if (!this.newStopName.trim() || !this.newStopTime.trim()) {
      alert('Preencha o nome e o horário da parada!');
      return;
    }
    this.newRoute.stops.push({ name: this.newStopName.trim(), time: this.newStopTime.trim() });
    this.newStopName = '';
    this.newStopTime = '';
  }

  removeStop(index: number) {
    this.newRoute.stops.splice(index, 1);
  }

  createRoute() {
    if (!this.newRoute.name || !this.newRoute.originDest || !this.newRoute.distance || !this.newRoute.time) {
      alert('Nome, Origem/Destino, Distância e Tempo são obrigatórios!');
      return;
    }

    let distStr = this.newRoute.distance.trim();
    if (!distStr.toLowerCase().endsWith('km')) distStr += ' km';

    let timeStr = this.newRoute.time.trim();
    if (/^\d+$/.test(timeStr)) timeStr += ' min';

    const route: Route = {
      id: 0,
      name: this.newRoute.name,
      description: this.newRoute.description,
      originDest: this.newRoute.originDest,
      distance: distStr,
      time: timeStr,
      capacity: this.newRoute.capacity,
      status: this.newRoute.status,
      stops: this.newRoute.stops
    };

    this.svc.addRoute(route);
    this.closeCreateModal();
  }
}
