import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { Trip } from '../models/dashboard.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  private svc = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

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
    console.log('TripsComponent ngOnInit called');
    this.loadTrips();
    this.loadDrivers();
    this.loadVehicles();
    this.loadRoutes();

    // Listen to route changes to reload data when tab is opened
    this.router.events.subscribe((event) => {
      if (event.constructor.name === 'NavigationEnd') {
        // Check if the current route is the trips route
        if (this.router.url === '/dashboard/viagens') {
          console.log('Trips route activated, reloading data');
          this.loadTrips();
          this.loadDrivers();
          this.loadVehicles();
          this.loadRoutes();
        }
      }
    });
  }

  loadTrips() {
    console.log('Loading trips...');
    this.svc.getTrips().subscribe({
      next: (data) => {
        console.log('Trips loaded successfully:', data);
        this.trips = data;
        this.scheduledToday = data.filter(t => t.status === 'agendada').length;
        this.totalPassengers = data.reduce((acc, t) => acc + t.studentsCount, 0);
        this.completed = data.filter(t => t.status === 'concluida').length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading trips:', err);
      }
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
    console.log('createTrip called with formData:', this.formData);
    if (!this.formData.rotaId || !this.formData.motoristaId || !this.formData.veiculoId
        || !this.formData.dataHoraPartida || !this.formData.dataHoraChegadaPrevista) {
      alert('Por favor, preencha todos os campos da viagem.');
      return;
    }
    this.svc.createTrip(this.formData).subscribe({
      next: (response) => {
        console.log('Trip created successfully:', response);
        this.closeCreateModal();
        this.loadTrips();
      },
      error: (err) => {
        alert('Erro ao criar viagem: ' + (err.error?.message || err.message || 'Verifique os campos e tente novamente'));
      }
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
    console.log('updateTrip called');
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
    console.log('confirmDelete called');
    const trip = this.selectedTrip();
    if (trip) {
      this.svc.deleteTrip(trip.id).subscribe({
        next: (response) => {
          console.log('Trip deleted successfully:', response);
          this.closeDeleteModal();
          this.loadTrips();
        },
        error: (err) => console.error('Erro ao excluir viagem:', err)
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