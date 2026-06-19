import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { Vehicle } from '../models/dashboard.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  private svc = inject(DashboardService);

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

  
  private readonly STORAGE_KEY = 'dashboard_vehicles_form';

  private saveFormToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.formData));
  }
  private loadFormFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) { try { const p = JSON.parse(saved); this.formData = { ...this.formData, ...p }; } catch {} }
  }
  private clearStorage() { localStorage.removeItem(this.STORAGE_KEY); }

  onFormChange() { this.saveFormToStorage(); }

  ngOnInit() {
    this.svc.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.filtered = data;
      this.totalVehicles = data.length;
      this.activeVehicles = data.filter(v => v.status === 'ativo').length;
      this.maintenanceVehicles = data.filter(v => v.status === 'manutencao').length;
      this.totalCapacity = data.reduce((acc, v) => acc + v.capacity, 0);
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
    this.loadFormFromStorage();
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createVehicle() {
    this.clearStorage();
    const data: Partial<Vehicle> = { code: this.formData.code, plate: this.formData.plate, model: this.formData.model, year: Number(this.formData.year), status: this.formData.status as Vehicle['status'], capacity: this.formData.capacity };
    this.svc.createVehicle(data).subscribe(() => {
      this.closeCreateModal();
      this.ngOnInit();
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
      this.svc.updateVehicle(vehicle.id, data).subscribe(() => {
        this.closeEditModal();
        this.ngOnInit();
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
      this.svc.deleteVehicle(vehicle.id).subscribe(() => {
        this.closeDeleteModal();
        this.ngOnInit();
      });
    }
  }
}
