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

  // Modal signals
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showViewModal = signal(false);

  // Selected trip for view/edit/delete
  selectedTrip = signal<Trip | null>(null);

  // Form data for creating/editing trips
  formData = {
    route: '',
    date: '',
    time: '',
    driver: '',
    vehicle: ''
  };

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.svc.getTrips().subscribe(data => {
      this.trips = data;
      this.scheduledToday = data.filter(t => t.status === 'agendada').length;
      this.totalPassengers = data.reduce((acc, t) => acc + t.studentsCount, 0);
      this.completed = data.filter(t => t.status === 'concluida').length;
    });
  }

  // View modal
  openViewModal(trip: Trip) {
    this.selectedTrip.set(trip);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedTrip.set(null);
  }

  // Create modal
  openCreateModal() {
    this.formData = { route: '', date: '', time: '', driver: '', vehicle: '' };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createTrip() {
    // Trips only support create on frontend (no update route/time)
    // The backend handles scheduling
    console.log('Creating trip:', this.formData);
    // Service call would go here - for now just close
    this.closeCreateModal();
    this.loadTrips();
  }

  // Edit modal
  openEditModal(trip: Trip) {
    this.selectedTrip.set(trip);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedTrip.set(null);
  }

  updateTrip() {
    console.log('Updating trip:', this.selectedTrip());
    this.closeEditModal();
    this.loadTrips();
  }

  // Delete modal
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
