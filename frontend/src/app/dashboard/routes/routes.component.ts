import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { Route } from '../models/dashboard.model';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Modals
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showViewModal = signal(false);
  selectedRoute = signal<Route | null>(null);

  private readonly STORAGE_KEY = 'dashboard_routes_form';

  // Form data
  formData: { name: string; description: string; originDest: string; status: string } = {
    name: '',
    description: '',
    originDest: '',
    status: 'Ativa'
  };

  private saveFormToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.formData));
  }
  private loadFormFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) { try { const p = JSON.parse(saved); this.formData = { ...this.formData, ...p }; } catch {} }
  }
  private clearStorage() { localStorage.removeItem(this.STORAGE_KEY); }

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.svc.getRoutes().subscribe(data => {
      this.routes = data;
      this.filtered = data;
      this.totalRoutes = data.length;
      this.activeRoutes = data.filter(r => r.status === 'Ativa').length;
      this.totalCapacity = data.reduce((acc, r) => acc + r.capacity, 0);
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

  // View
  openViewModal(route: Route) {
    this.selectedRoute.set(route);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedRoute.set(null);
  }

  // Create
  openCreateModal() {
    this.loadFormFromStorage();
    this.showCreateModal.set(true);
  }

  onFormChange() {
    this.saveFormToStorage();
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createRoute() {
    if (!this.formData.name) return;
    this.clearStorage();
    this.svc.createRoute({
      name: this.formData.name,
      description: this.formData.description,
      originDest: this.formData.originDest,
      status: this.formData.status as any
    }).subscribe({
      next: () => {
        this.closeCreateModal();
        this.ngOnInit();
      },
      error: (err) => console.error('Erro ao criar rota:', err)
    });
  }

  // Edit
  openEditModal(route: Route) {
    this.selectedRoute.set(route);
    this.formData = {
      name: route.name,
      description: route.description,
      originDest: route.originDest,
      status: route.status
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedRoute.set(null);
  }

  updateRoute() {
    const route = this.selectedRoute();
    if (!route) return;
    this.svc.updateRoute(route.id, {
      name: this.formData.name,
      description: this.formData.description,
      originDest: this.formData.originDest,
      status: this.formData.status as any
    }).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadRoutes();
      },
      error: (err) => console.error('Erro ao atualizar rota:', err)
    });
  }

  // Delete
  openDeleteModal(route: Route) {
    this.selectedRoute.set(route);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedRoute.set(null);
  }

  confirmDelete() {
    const route = this.selectedRoute();
    if (!route) return;
    this.svc.deleteRoute(route.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadRoutes();
      },
      error: (err) => console.error('Erro ao excluir rota:', err)
    });
  }
}