import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { map, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TripStopState {
  nome: string;
  chegou: boolean;
}

export interface TripTrackingState {
  tripId: number;
  routeName: string;
  routeDescription: string;
  status: string;
  currentStopIndex: number;
  nextStop: string;
  updatedAt: number;
  stops: TripStopState[];
}

@Injectable({
  providedIn: 'root'
})
export class TripTrackingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public watchStudentTrip(): Observable<TripTrackingState | null> {
    return timer(0, 10000).pipe(
      switchMap(() => this.http.get<any[]>(`${this.apiUrl}/student/viagens`)),
      map((viagens) => this.mapActiveTrip(viagens)),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private mapActiveTrip(viagens: any[]): TripTrackingState | null {
    const viagem = viagens.find(v => v.status === 'EM_ANDAMENTO' || v.status === 'AGENDADA') || viagens[0];
    if (!viagem) return null;

    const rawStops = viagem.rota?.paradas;
    let stops: string[] = [];
    if (rawStops) {
      try {
        const parsed = typeof rawStops === 'string' ? JSON.parse(rawStops) : rawStops;
        stops = Array.isArray(parsed) ? parsed : [];
      } catch {
        stops = [];
      }
    }

    const currentIndex = Math.max(0, Number(viagem.paradaAtualIndex ?? 0));
    const mappedStops: TripStopState[] = stops.map((nome, index) => ({
      nome,
      chegou: index <= currentIndex
    }));

    return {
      tripId: Number(viagem.id),
      routeName: viagem.rota?.nomeRota || 'Rota ativa',
      routeDescription: viagem.rota?.descricao || '',
      status: viagem.status || 'AGENDADA',
      currentStopIndex: currentIndex,
      nextStop: stops[currentIndex + 1] || 'Destino final',
      updatedAt: Date.now(),
      stops: mappedStops
    };
  }
}
