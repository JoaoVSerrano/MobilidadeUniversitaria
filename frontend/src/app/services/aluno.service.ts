import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  userType: string;
  dataNascimento?: string;
}

export interface AlunoUpdate {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  senha?: string;
  dataNascimento?: string;
}

export interface Viagem {
  id: number;
  rota: string;
  horario: string;
  status: string;
  passageiros: number;
  ocupacao: number;
}

export interface PresencaDigital {
  id: number;
  dataHoraReserva: string;
  dataHoraValidacao: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  getAlunoById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/alunos/${id}`, { headers: this.getHeaders() });
  }

  updateAluno(id: number, data: AlunoUpdate): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/alunos/${id}`, data, { headers: this.getHeaders() });
  }

  getViagensByAlunoId(id: number): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.apiUrl}/alunos/${id}/viagens`, { headers: this.getHeaders() });
  }

  getPresencasByAlunoId(id: number): Observable<PresencaDigital[]> {
    return this.http.get<PresencaDigital[]>(`${this.apiUrl}/alunos/${id}/presencas`, { headers: this.getHeaders() });
  }
}