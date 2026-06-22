import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripTrackingService, TripTrackingState } from '../services/trip-tracking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aluno-rastreamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-rastreamento.component.html',
  styleUrl: './app-aluno-rastreamento.component.css'
})
export class AppAlunoRastreamentoComponent implements OnInit, OnDestroy {
  private trackingService = inject(TripTrackingService);
  private sub?: Subscription;

  tripState = signal<TripTrackingState | null>(null);
  isConnected = signal(false);

  ngOnInit() {
    this.sub = this.trackingService.watchStudentTrip().subscribe(state => {
      this.tripState.set(state);
      this.isConnected.set(!!state);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  getProgress(): number {
    const state = this.tripState();
    if (!state || state.stops.length === 0) return 0;
    return Math.min(100, Math.round(((state.currentStopIndex + 1) / state.stops.length) * 100));
  }
}
