import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, interval } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TripLocation {
  tripId: number;
  latitude: number;
  longitude: number;
  velocidade: number;
  proximaParada: string;
  distanciaRestante: number;
  timestamp: number;
}

// Mock data for demo
const MOCK_ROUTE = [
  { lat: -23.5505, lng: -46.6333, nome: 'Terminal Central' },
  { lat: -23.5431, lng: -46.6420, nome: 'Praça da Sé' },
  { lat: -23.5614, lng: -46.6569, nome: 'Avenida Paulista' },
  { lat: -23.5868, lng: -46.6820, nome: 'Universidade' }
];

@Injectable({
  providedIn: 'root'
})
export class TripTrackingService {
  private locationSubject = new BehaviorSubject<TripLocation | null>(null);
  private mockIndex = 0;

  constructor() {
    // Will be initialized only when subscribeToTrip is called
  }

  /**
   * Subscribe to real-time trip location updates.
   * Falls back to mock data if WebSocket is not available.
   */
  public subscribeToTrip(tripId: number): Observable<TripLocation | null> {
    this.mockIndex = 0;
    this.startMockUpdates(tripId);
    return this.locationSubject.asObservable();
  }

  private startMockUpdates(tripId: number): void {
    // Simulate real-time updates with mock data
    interval(5000).pipe(take(MOCK_ROUTE.length - 1)).subscribe(() => {
      this.mockIndex++;
      if (this.mockIndex < MOCK_ROUTE.length) {
        const point = MOCK_ROUTE[this.mockIndex];
        const location: TripLocation = {
          tripId,
          latitude: point.lat,
          longitude: point.lng,
          velocidade: Math.round(30 + Math.random() * 20),
          proximaParada: MOCK_ROUTE[this.mockIndex + 1]?.nome || 'Destino',
          distanciaRestante: Math.round(1 + Math.random() * 3),
          timestamp: Date.now()
        };
        this.locationSubject.next(location);
      }
    });
  }

  /**
   * Publish location update (for drivers)
   */
  public publishLocation(tripId: number, location: TripLocation): void {
    // In production, this would send to the WebSocket
    console.log('Publishing location:', tripId, location);
  }

  /**
   * Cleanup when leaving the tracking view
   */
  public deactivate(): void {
    this.locationSubject.next(null);
  }
}