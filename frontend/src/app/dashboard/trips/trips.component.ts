import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { Trip } from '../models/dashboard.model';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  private svc = inject(DashboardService);

  trips: Trip[] = [];
  scheduledToday = 0;
  totalPassengers = 0;
  completed = 0;

  drivers: any[] = [];
  vehicles: any[] = [];
  routes: any[] = [];

  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showViewModal = signal(false);
  selectedTrip = signal<Trip | null>(null);

  formData = {
    rotaId: '',
    motoristaId: '',
    veiculoId: '',
    dataHoraPartida: '',
    dataHoraChegadaPrevista: ''
  };

  ngOnInit() {
    this.loadTrips();
    this.loadDrivers();
    this.loadVehicles();
    this.loadRoutes();
  }

  loadTrips() {
    this.svc.getTrips().subscribe(data => {
      this.trips = data;
      this.scheduledToday = data.filter(t => t.status === 'agendada').length;
      this.totalPassengers = data.reduce((acc, t) => acc + t.studentsCount, 0);
      this.completed = data.filter(t => t.status === 'concluida').length;
    });
  }

  loadDrivers() {
    this.svc.getDrivers().subscribe(data => this.drivers = data);
  }

  loadVehicles() {
    this.svc.getVehiclesList().subscribe(data => this.vehicles = data);
  }

  loadRoutes() {
    this.svc.getRoutes().subscribe(data => this.routes = data);
  }

  openViewModal(trip: Trip) {
    this.selectedTrip.set(trip);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedTrip.set(null);
  }

  openCreateModal() {
    this.formData = { rotaId: '', motoristaId: '', veiculoId: '', dataHoraPartida: '', dataHoraChegadaPrevista: '' };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createTrip() {
    if (!this.formData.rotaId || !this.formData.motoristaId || !this.formData.veiculoId
        || !this.formData.dataHoraPartida || !this.formData.dataHoraChegadaPrevista) {
      return;
    }
    this.svc.createTrip(this.formData).subscribe({
      next: () => { this.closeCreateModal(); this.loadTrips(); },
      error: (err) => console.error('Erro ao criar viagem:', err)
    });
  }

  openEditModal(trip: Trip) {
    this.selectedTrip.set(trip);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedTrip.set(null);
  }

  updateTrip() {
    this.closeEditModal();
    this.loadTrips();
  }

  openDeleteModal(trip: Trip) {
    this.selectedTrip.set(trip);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedTrip.set(null);
  }

  confirmDelete() {
    const trip = this.selectedTrip();
    if (trip) {
      this.svc.deleteTrip(trip.id).subscribe(() => {
        this.closeDeleteModal();
        this.loadTrips();
      });
    }
  }

  getStatusLabel(status: Trip['status']): string {
    const labels: Record<string, string> = {
      'agendada': 'agendada',
      'concluida': 'concluída',
      'pending': 'pendente',
      'in-progress': 'em trânsito',
      'completed': 'finalizada'
    };
    return labels[status] ?? status;
  }
}