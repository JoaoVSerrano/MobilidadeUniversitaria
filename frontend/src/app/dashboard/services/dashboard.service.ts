import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { StatCard, User, Route, Vehicle, Trip, Document, DailyDemand, RouteOccupancy } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private api = inject(ApiService);

  public getStats(): Observable<any> {
    return this.api.get('/dashboard/kpis');
  }

  public getUsers(): Observable<User[]> {
    return this.api.get('/users');
  }

  public createUser(user: User): Observable<User> {
    return this.api.post('/users', user);
  }

  public updateUser(id: number, user: User): Observable<User> {
    return this.api.put(`/users/${id}`, user);
  }

  public deleteUser(id: number): Observable<any> {
    return this.api.delete(`/users/${id}`);
  }

  public updateUserStatus(id: number, status: string): Observable<any> {
    return this.api.put(`/users/${id}/status`, { status });
  }

  public getRoutes(): Observable<Route[]> {
    return this.api.get('/routes');
  }

  public createRoute(route: Route): Observable<Route> {
    return this.api.post('/routes', route);
  }

  public updateRoute(id: number, route: Route): Observable<Route> {
    return this.api.put(`/routes/${id}`, route);
  }

  public deleteRoute(id: number): Observable<any> {
    return this.api.delete(`/routes/${id}`);
  }

  public updateRouteStatus(id: number, ativa: boolean): Observable<any> {
    return this.api.put(`/routes/${id}/status`, { ativa });
  }

  public getVehicles(): Observable<Vehicle[]> {
    return this.api.get('/vehicles');
  }

  public createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.api.post('/vehicles', vehicle);
  }

  public updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.api.put(`/vehicles/${id}`, vehicle);
  }

  public deleteVehicle(id: number): Observable<any> {
    return this.api.delete(`/vehicles/${id}`);
  }

  public updateVehicleStatus(id: number, status: string): Observable<any> {
    return this.api.put(`/vehicles/${id}/status`, { status });
  }

  public getTrips(): Observable<Trip[]> {
    return this.api.get('/trips');
  }

  public createTrip(trip: Trip): Observable<Trip> {
    return this.api.post('/trips', trip);
  }

  public deleteTrip(id: number): Observable<any> {
    return this.api.delete(`/trips/${id}`);
  }

  public getSystemSettings(): Observable<any> {
    return this.api.get('/system/settings');
  }

  public updateSystemSettings(settings: any): Observable<any> {
    return this.api.put('/system/settings', settings);
  }

  public sendNotification(request: any): Observable<any> {
    return this.api.post('/notifications/send', request);
  }

  public getDocumentStats(): Observable<any> {
    return this.api.get('/documents/stats');
  }

  public getDocuments(): Observable<Document[]> {
    return this.api.get('/documents');
  }

  public uploadDocument(file: File, nome: string, tipo: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nome', nome);
    formData.append('tipo', tipo);
    return this.api.post('/documents/upload', formData, true);
  }

  public downloadDocument(id: number): Observable<Blob> {
    return this.api.get(`/documents/${id}/download`) as unknown as Observable<Blob>;
  }

  public deleteDocument(id: number): Observable<any> {
    return this.api.delete(`/documents/${id}`);
  }

  public getDailyDemand(): Observable<DailyDemand[]> {
    return this.api.get('/dashboard/demand-by-day');
  }

  public getRouteOccupancy(): Observable<RouteOccupancy[]> {
    return this.api.get('/dashboard/ocupacao-por-rota');
  }
}
