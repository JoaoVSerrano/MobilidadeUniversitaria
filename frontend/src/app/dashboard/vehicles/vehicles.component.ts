import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { Vehicle } from '../models/dashboard.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  private svc = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Modal signals
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showViewModal = signal(false);
  selectedVehicle = signal<Vehicle | null>(null);

  // Form data
  formData: { code: string; plate: string; model: string; year: number | string; status: 'ativo' | 'manutencao' | 'inativo'; capacity: number } = {
    code: '',
    plate: '',
    model: '',
    year: '',
    status: 'ativo',
    capacity: 0
  };

  vehicles: Vehicle[] = [];
  filtered: Vehicle[] = [];
  search: string = '';
  filterStatus: string = 'Todos';

  totalVehicles = 0;
  activeVehicles = 0;
  maintenanceVehicles = 0;
  totalCapacity = 0;

  ngOnInit() {
    this.loadVehicles();

    // Listen to route changes to reload data when tab is opened
    this.router.events.subscribe((event) => {
      if (event.constructor.name === 'NavigationEnd') {
        if (this.router.url === '/dashboard/veiculos') {
          this.loadVehicles();
        }
      }
    });
  }

  loadVehicles() {
    this.svc.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filtered = data;
        this.totalVehicles = data.length;
        this.activeVehicles = data.filter(v => v.status === 'ativo').length;
        this.maintenanceVehicles = data.filter(v => v.status === 'manutencao').length;
        this.totalCapacity = data.reduce((acc, v) => acc + v.capacity, 0);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
      }
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
    this.filtered = this.vehicles.filter(v => {
      const matchSearch =
        v.code.toLowerCase().includes(this.search.toLowerCase()) ||
        v.plate.toLowerCase().includes(this.search.toLowerCase()) ||
        v.model.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = this.filterStatus === 'Todos' || v.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  // View Modal
  openViewModal(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedVehicle.set(null);
  }

  // Create Modal
  openCreateModal() {
    this.formData = { code: '', plate: '', model: '', year: '', status: 'ativo', capacity: 0 };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createVehicle() {
    const data: Partial<Vehicle> = { code: this.formData.code, plate: this.formData.plate, model: this.formData.model, year: Number(this.formData.year), status: this.formData.status as Vehicle['status'], capacity: this.formData.capacity };
    this.svc.createVehicle(data).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadVehicles();
      },
      error: (err) => console.error('Erro ao criar veículo:', err)
    });
  }

  // Edit Modal
  openEditModal(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
    this.formData = {
      code: vehicle.code,
      plate: vehicle.plate,
      model: vehicle.model,
      year: vehicle.year,
      status: vehicle.status,
      capacity: vehicle.capacity
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedVehicle.set(null);
  }

  updateVehicle() {
    const vehicle = this.selectedVehicle();
    if (vehicle) {
      const data: Partial<Vehicle> = { code: this.formData.code, plate: this.formData.plate, model: this.formData.model, year: Number(this.formData.year), status: this.formData.status as Vehicle['status'], capacity: this.formData.capacity };
      this.svc.updateVehicle(vehicle.id, data).subscribe({
        next: () => {
          this.closeEditModal();
          this.loadVehicles();
        },
        error: (err) => console.error('Erro ao atualizar veículo:', err)
      });
    }
  }

  // Delete Modal
  openDeleteModal(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedVehicle.set(null);
  }

  confirmDelete() {
    const vehicle = this.selectedVehicle();
    if (vehicle) {
      this.svc.deleteVehicle(vehicle.id).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadVehicles();
        },
        error: (err) => console.error('Erro ao excluir veículo:', err)
      });
    }
  }
}
