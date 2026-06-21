import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MotoristaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMotoristaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/motoristas/${id}`);
  }

  updateMotorista(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/motoristas/${id}`, data);
  }

  getViagensByMotoristaId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/motoristas/${id}/viagens`);
  }

  getNotificacoesMotorista(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notificacoes/motorista`);
  }

  marcarNotificacaoMotoristaLida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/notificacoes/motorista/${id}/lida`, {});
  }
}
