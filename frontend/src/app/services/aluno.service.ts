import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AlunoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAlunoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/alunos/${id}`);
  }

  updateAluno(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/alunos/${id}`, data);
  }

  getViagensByAlunoId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alunos/${id}/viagens`);
  }

  getPresencasByAlunoId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alunos/${id}/presencas`);
  }

  getNotificacoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notificacoes`);
  }

  marcarNotificacaoLida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/notificacoes/${id}/lida`, {});
  }
}
