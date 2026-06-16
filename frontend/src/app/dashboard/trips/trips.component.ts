import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Trip } from '../models/dashboard.model';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  private svc = inject(DashboardService);

  trips: Trip[] = [];
  scheduledToday = 0;
  totalPassengers = 0;
  completed = 0;

  ngOnInit() {
    this.svc.getTrips().subscribe(data => {
      this.trips = data;
      this.scheduledToday = data.filter(t => t.status === 'agendada').length;
      this.totalPassengers = data.reduce((acc, t) => acc + t.studentsCount, 0);
      this.completed = data.filter(t => t.status === 'concluida').length;
    });
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
