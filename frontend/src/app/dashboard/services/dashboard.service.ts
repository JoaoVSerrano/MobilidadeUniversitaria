import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { User, Route, Vehicle, Trip, Document, DailyDemand, RouteOccupancy } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private api = inject(ApiService);

  public getStats(): Observable<any> {
    return this.api.get('/dashboard/kpis');
  }

  // Users API - map backend response to frontend model
  public getUsers(): Observable<User[]> {
    return this.api.get('/usuarios').pipe(
      map((data) => (data as any[]).map(u => ({
        id: u.id,
        name: u.nome,
        cpf: u.cpf,
        email: u.email,
        phone: u.telefone,
        type: u.tipoUsuario === 'GESTOR' ? 'admin' : (u.tipoUsuario?.toLowerCase() || 'aluno'),
        status: 'Ativo' as const,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        address: u.endereco ? {
          cep: u.endereco.cep,
          rua: u.endereco.rua,
          bairro: u.endereco.bairro,
          numero: u.endereco.numero,
          complemento: u.endereco.complemento,
          tipoLocal: u.endereco.tipoLocal
        } : undefined,
        faculdade: u.faculdade ? {
          id: u.faculdade.id,
          nome: u.faculdade.nome
        } : undefined
      })))
    );
  }

  public createUser(user: Partial<User> & { type?: string; password?: string }): Observable<any> {
    const tipoMap: Record<string, string> = {
      'aluno': 'ALUNO',
      'motorista': 'MOTORISTA',
      'admin': 'GESTOR'
    };
    return this.api.post('/usuarios', {
      nome: user.name,
      email: user.email,
      cpf: user.cpf,
      telefone: user.phone,
      senha: user.password || 'password123',
      tipoUsuario: tipoMap[user.type || 'aluno'] || 'ALUNO'
    });
  }

  public updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.api.put(`/usuarios/${id}`, {
      nome: user.name,
      email: user.email,
      telefone: user.phone
    }) as Observable<User>;
  }

  public deleteUser(id: number): Observable<any> {
    return this.api.delete(`/usuarios/${id}`);
  }

  public updateUserStatus(id: number, status: string): Observable<any> {
    return this.api.put(`/usuarios/${id}/status`, { status });
  }

  // Routes API - map backend response
  public getRoutes(): Observable<Route[]> {
    return this.api.get('/rotas').pipe(
      map((data) => (data as any[]).map(r => {
        let stops: RouteStop[] = [];
        if (r.paradas) {
          try {
            const parsed = typeof r.paradas === 'string' ? JSON.parse(r.paradas) : r.paradas;
            if (Array.isArray(parsed)) {
              stops = parsed.map((s: string, i: number) => ({ name: s, time: '' }));
            }
          } catch { /* ignore parse errors */ }
        }
        return {
          id: r.id,
          name: r.nomeRota,
          description: r.descricao,
          originDest: r.pontoParada,
          status: r.ativa ? 'Ativa' as const : 'Inativa' as const,
          stops,
          paradas: typeof r.paradas === 'string' ? JSON.parse(r.paradas || '[]') : (r.paradas || [])
        };
      }))
    );
  }

  public createRoute(route: Partial<Route> & { paradas?: string[] }): Observable<Route> {
    const paradasJson = route.paradas ? JSON.stringify(route.paradas) : null;
    return this.api.post('/rotas', {
      nomeRota: route.name,
      descricao: route.description,
      pontoParada: route.originDest,
      paradas: paradasJson,
      ativa: true
    }) as Observable<Route>;
  }

  public updateRoute(id: number, route: Partial<Route> & { paradas?: string[] }): Observable<Route> {
    const paradasJson = route.paradas ? JSON.stringify(route.paradas) : null;
    return this.api.put(`/rotas/${id}`, {
      nomeRota: route.name,
      descricao: route.description,
      pontoParada: route.originDest,
      paradas: paradasJson,
      ativa: route.status === 'Ativa'
    }) as Observable<Route>;
  }

  public deleteRoute(id: number): Observable<any> {
    return this.api.delete(`/rotas/${id}`);
  }

  public updateRouteStatus(id: number, ativa: boolean): Observable<any> {
    return this.api.put(`/rotas/${id}/status`, { ativa });
  }

  // Vehicles API
  public getVehicles(): Observable<Vehicle[]> {
    return this.api.get('/veiculos').pipe(
      map((data) => (data as any[]).map(v => ({
        id: v.id,
        plate: v.placa,
        model: v.modelo,
        year: v.ano,
        status: v.status?.toLowerCase() || 'ativo',
        capacity: v.capacidadeTotal,
        kmRodados: v.kmRodados ?? 0,
        proximaRevisao: v.proximaRevisao ?? null
      })))
    );
  }

  public createVehicle(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.api.post('/veiculos', {
      placa: vehicle.plate,
      modelo: vehicle.model,
      capacidadeTotal: vehicle.capacity,
      ano: vehicle.year || null,
      status: vehicle.status?.toUpperCase() || 'ATIVO',
      kmRodados: vehicle.kmRodados ?? 0
    }) as Observable<Vehicle>;
  }

  public updateVehicle(id: number, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.api.put(`/veiculos/${id}`, {
      placa: vehicle.plate,
      modelo: vehicle.model,
      capacidadeTotal: vehicle.capacity,
      ano: vehicle.year || null,
      status: vehicle.status?.toUpperCase(),
      kmRodados: vehicle.kmRodados
    }) as Observable<Vehicle>;
  }

  public deleteVehicle(id: number): Observable<any> {
    return this.api.delete(`/veiculos/${id}`);
  }

  public updateVehicleStatus(id: number, status: string): Observable<any> {
    return this.api.put(`/veiculos/${id}`, { status: status.toUpperCase() });
  }

  // Trips API
  public getTrips(): Observable<Trip[]> {
    return this.api.get('/viagens').pipe(
      map((data) => (data as any[]).map(t => ({
        id: t.id,
        route: t.rota?.nomeRota || 'Rota não definida',
        date: t.dataHoraPartida
          ? new Date(t.dataHoraPartida).toLocaleDateString('pt-BR')
          : '—',
        time: t.dataHoraPartida
          ? new Date(t.dataHoraPartida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          : '—',
        driver: t.motorista?.nome || 'A definir',
        vehicle: t.veiculo?.modelo || t.veiculo?.placa || 'A definir',
        studentsCount: 0,
        status: this.mapTripStatus(t.status)
      })))
    );
  }

  public createTrip(trip: any): Observable<Trip> {
    const formatDate = (dt: string) => {
      if (!dt) return '';
      const [date, time] = dt.split('T');
      const [y, m, d] = date.split('-');
      return `${d}/${m}/${y} ${time || '00:00'}`;
    };

    return this.api.post('/viagens', {
      rotaId: Number(trip.rotaId),
      motoristaId: Number(trip.motoristaId),
      veiculoId: Number(trip.veiculoId),
      dataHoraPartida: formatDate(trip.dataHoraPartida),
      dataHoraChegadaPrevista: formatDate(trip.dataHoraChegadaPrevista)
    }) as Observable<Trip>;
  }

  public updateTrip(id: number, trip: any): Observable<Trip> {
    const formatDate = (dt: string) => {
      if (!dt) return '';
      const [date, time] = dt.split('T');
      const [y, m, d] = date.split('-');
      return `${d}/${m}/${y} ${time || '00:00'}`;
    };

    return this.api.put(`/viagens/${id}`, {
      rotaId: Number(trip.rotaId),
      motoristaId: Number(trip.motoristaId),
      veiculoId: Number(trip.veiculoId),
      dataHoraPartida: formatDate(trip.dataHoraPartida),
      dataHoraChegadaPrevista: formatDate(trip.dataHoraChegadaPrevista)
    }) as Observable<Trip>;
  }

  public getDrivers(): Observable<any[]> {
    return this.api.get('/motoristas').pipe(
      map((data) => (data as any[]).map(d => ({
        id: d.id,
        nome: d.nome,
        email: d.email
      })))
    );
  }

  public getVehiclesList(): Observable<any[]> {
    return this.api.get('/veiculos');
  }

  public deleteTrip(id: number): Observable<any> {
    return this.api.delete(`/viagens/${id}`);
  }

  private mapTripStatus(status: string): Trip['status'] {
    const statusMap: Record<string, Trip['status']> = {
      'AGENDADA': 'agendada',
      'EM_ANDAMENTO': 'in-progress',
      'FINALIZADA': 'completed',
      'CANCELADA': 'concluida'
    };
    return statusMap[status] || 'pending';
  }

  // Notifications API
  public getNotifications(): Observable<any[]> {
    return this.api.get('/notificacoes');
  }

  public sendNotification(request: any): Observable<any> {
    return this.api.post('/notificacoes', request);
  }

  // System Settings API
  public getSystemSettings(): Observable<any> {
    return this.api.get('/system/settings');
  }

  public updateSystemSettings(settings: any): Observable<any> {
    return this.api.put('/system/settings', settings);
  }

  // Documents API
  public getDocumentStats(): Observable<any> {
    return this.api.get('/documents/stats');
  }

  public getDocuments(): Observable<Document[]> {
    return this.api.get('/documents') as Observable<Document[]>;
  }

  public uploadDocument(file: File, nome: string, tipo: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nome', nome);
    formData.append('tipo', tipo);
    return this.api.post('/documents/upload', formData, true) as Observable<Document>;
  }

  public downloadDocument(id: number): Observable<Blob> {
    return this.api.get(`/documents/${id}/download`) as unknown as Observable<Blob>;
  }

  public deleteDocument(id: number): Observable<any> {
    return this.api.delete(`/documents/${id}`);
  }

  // Dashboard APIs
  public getDailyDemand(): Observable<DailyDemand[]> {
    return this.api.get('/dashboard/demanda-por-dia');
  }

  public getRouteOccupancy(): Observable<RouteOccupancy[]> {
    return this.api.get('/dashboard/ocupacao-por-rota');
  }
}