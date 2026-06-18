import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Motorista {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  userType: string;
  cnhNumero: string;
  vencimentoCNH: string;
}

export interface MotoristaUpdate {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  senha?: string;
  cnhNumero?: string;
  vencimentoCNH?: string;
}

export interface Viagem {
  id: number;
  rota: string;
  horario: string;
  status: string;
  passageiros: number;
  ocupacao: number;
}

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  getMotoristaById(id: number): Observable<Motorista> {
    return this.http.get<Motorista>(`${this.apiUrl}/motoristas/${id}`, { headers: this.getHeaders() });
  }

  updateMotorista(id: number, data: MotoristaUpdate): Observable<Motorista> {
    return this.http.put<Motorista>(`${this.apiUrl}/motoristas/${id}`, data, { headers: this.getHeaders() });
  }

  getViagensByMotoristaId(id: number): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.apiUrl}/motoristas/${id}/viagens`, { headers: this.getHeaders() });
  }
}