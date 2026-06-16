import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { SearchService } from '../services/search.service';
import { Vehicle } from '../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit, OnDestroy {
  private svc = inject(DashboardService);
  private searchSvc = inject(SearchService);

  vehicles: Vehicle[] = [];
  filtered: Vehicle[] = [];
  search: string = '';
  filterStatus: string = 'Todos';

  totalVehicles = 0;
  activeVehicles = 0;
  maintenanceVehicles = 0;
  totalCapacity = 0;

  // Modal Control
  showCreateModal = false;
  newVehicle: Partial<Vehicle> = {
    code: '',
    plate: '',
    model: '',
    year: 2024,
    status: 'ativo',
    capacity: 45,
    mileage: '',
    nextRevision: ''
  };

  private sub = new Subscription();

  ngOnInit() {
    this.sub.add(
      this.svc.getVehicles().subscribe(data => {
        this.vehicles = data;
        this.filtered = data;
        this.totalVehicles = data.length;
        this.activeVehicles = data.filter(v => v.status === 'ativo').length;
        this.maintenanceVehicles = data.filter(v => v.status === 'manutencao').length;
        this.totalCapacity = data.reduce((acc, v) => acc + v.capacity, 0);
        this.applyFilters();
      })
    );

    // Sincronizar busca global
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
    this.filtered = this.vehicles.filter(v => {
      const matchSearch =
        v.code.toLowerCase().includes(this.search.toLowerCase()) ||
        v.plate.toLowerCase().includes(this.search.toLowerCase()) ||
        v.model.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = this.filterStatus === 'Todos' || v.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  // Modal Actions
  openCreateModal() {
    this.showCreateModal = true;
    this.newVehicle = {
      code: '',
      plate: '',
      model: '',
      year: 2024,
      status: 'ativo',
      capacity: 45,
      mileage: '',
      nextRevision: ''
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createVehicle() {
    if (!this.newVehicle.code || !this.newVehicle.plate || !this.newVehicle.model) {
      alert('Código, Placa e Modelo são obrigatórios!');
      return;
    }

    // Standardize mileage (append 'k' if missing and is numeric, else leave as is)
    let kmStr = (this.newVehicle.mileage || '0').trim();
    if (/^\d+$/.test(kmStr)) {
      kmStr += 'k';
    }

    // Format revision date (if empty, default to 3 months from now)
    let revStr = (this.newVehicle.nextRevision || '').trim();
    if (!revStr) {
      const future = new Date();
      future.setMonth(future.getMonth() + 3);
      const dd = String(future.getDate()).padStart(2, '0');
      const mm = String(future.getMonth() + 1).padStart(2, '0');
      const yyyy = future.getFullYear();
      revStr = `${dd}/${mm}/${yyyy}`;
    }

    const vehicle: Vehicle = {
      id: 0,
      code: this.newVehicle.code,
      plate: this.newVehicle.plate,
      model: this.newVehicle.model,
      year: this.newVehicle.year || 2024,
      status: this.newVehicle.status as Vehicle['status'],
      capacity: this.newVehicle.capacity || 45,
      mileage: kmStr,
      nextRevision: revStr
    };

    this.svc.addVehicle(vehicle);
    this.closeCreateModal();
  }
}
