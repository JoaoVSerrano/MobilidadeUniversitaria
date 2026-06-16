import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { Trip, Route, Vehicle, User } from '../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit, OnDestroy {
  private svc = inject(DashboardService);

  trips: Trip[] = [];
  scheduledToday = 0;
  totalPassengers = 0;
  completed = 0;

  // For select dropdowns in the form
  routes: Route[] = [];
  drivers: User[] = [];
  vehicles: Vehicle[] = [];

  // Modal Control
  showCreateModal = false;
  newTrip = {
    route: '',
    date: '',
    time: '',
    driver: '',
    vehicle: '',
    studentsCount: 0,
    status: 'agendada' as Trip['status']
  };

  private sub = new Subscription();

  ngOnInit() {
    this.sub.add(
      this.svc.getTrips().subscribe(data => {
        this.trips = data;
        this.scheduledToday = data.filter(t => t.status === 'agendada').length;
        this.totalPassengers = data.reduce((acc, t) => acc + t.studentsCount, 0);
        this.completed = data.filter(t => t.status === 'concluida').length;
      })
    );

    // Populate dynamic options
    this.sub.add(this.svc.getRoutes().subscribe(r => { this.routes = r; }));
    this.sub.add(this.svc.getUsers().subscribe(u => {
      this.drivers = u.filter(user => user.type === 'motorista');
    }));
    this.sub.add(this.svc.getVehicles().subscribe(v => {
      this.vehicles = v.filter(vehicle => vehicle.status === 'ativo');
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  // Modal Actions
  openCreateModal() {
    this.showCreateModal = true;
    // Default date to today
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.newTrip = {
      route: this.routes[0]?.name || '',
      date: `${dd}/${mm}/${yyyy}`,
      time: '07:30',
      driver: this.drivers[0]?.name || '',
      vehicle: this.vehicles[0]?.code || '',
      studentsCount: 0,
      status: 'agendada'
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createTrip() {
    if (!this.newTrip.route || !this.newTrip.date || !this.newTrip.time || !this.newTrip.driver || !this.newTrip.vehicle) {
      alert('Rota, Data, Horário, Motorista e Veículo são obrigatórios!');
      return;
    }

    const trip: Trip = {
      id: 0,
      route: this.newTrip.route,
      date: this.newTrip.date,
      time: this.newTrip.time,
      driver: this.newTrip.driver,
      vehicle: this.newTrip.vehicle,
      studentsCount: this.newTrip.studentsCount || 0,
      status: this.newTrip.status
    };

    this.svc.addTrip(trip);
    this.closeCreateModal();
  }
}
