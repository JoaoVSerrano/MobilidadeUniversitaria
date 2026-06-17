import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class TripTrackingService {
  private client: Client;
  private locationSubject = new BehaviorSubject<TripLocation | null>(null);

  constructor() {
    const baseUrl = environment.apiUrl.replace('/api', '');
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
      debug: (str) => console.log(str),
    });
  }

  public subscribeToTrip(tripId: number): Observable<TripLocation | null> {
    this.client.onConnect = () => {
      this.client.subscribe(`/topic/trips/${tripId}/location`, (message: Message) => {
        const location: TripLocation = JSON.parse(message.body);
        this.locationSubject.next(location);
      });
    };

    if (!this.client.active) {
      this.client.activate();
    }
    return this.locationSubject.asObservable();
  }

  public publishLocation(tripId: number, location: TripLocation) {
    if (this.client.active) {
      this.client.publish({
        destination: `/app/trips/${tripId}/location`,
        body: JSON.stringify(location),
      });
    }
  }

  public deactivate() {
    this.client.deactivate();
  }
}
