import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-motorista-viagens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-motorista-viagens/app-motorista-viagens.component.html',
  styleUrl: './app-motorista-viagens/app-motorista-viagens.component.css'
})
export class AppMotoristaViagensComponent implements OnInit {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  viagens = signal<any[]>([]);
  isLoading = signal(true);
  erro = signal('');

  ngOnInit() {
    this.http.get<any[]>(`${this.baseUrl}/driver/trips/today`).subscribe({
      next: (data) => { this.viagens.set(data); this.isLoading.set(false); },
      error: (err: any) => {
        this.erro.set(err.error?.message || 'Erro ao carregar viagens.');
        this.isLoading.set(false);
      }
    });
  }

  formatHora(dt: string): string {
    if (!dt) return '--:--';
    return new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  iniciar(id: number) {
    this.http.post<any>(`${this.baseUrl}/driver/trips/${id}/start`, {}).subscribe({
      next: (updated) => this.viagens.update(vs => vs.map(v => v.id === id ? updated : v)),
      error: (err: any) => this.erro.set(err.error?.message || 'Erro ao iniciar viagem.')
    });
  }

  finalizar(id: number) {
    this.http.post<any>(`${this.baseUrl}/driver/trips/${id}/finish`, {}).subscribe({
      next: (updated) => this.viagens.update(vs => vs.map(v => v.id === id ? updated : v)),
      error: (err: any) => this.erro.set(err.error?.message || 'Erro ao finalizar viagem.')
    });
  }

  getProgressWidth(status?: string): string {
    switch (status) {
      case 'AGENDADA': return '0%';
      case 'EM_ANDAMENTO': return '50%';
      case 'FINALIZADA': return '100%';
      default: return '0%';
    }
  }

  getProgressLabel(status?: string): string {
    switch (status) {
      case 'AGENDADA': return 'Aguardando';
      case 'EM_ANDAMENTO': return 'Em andamento';
      case 'FINALIZADA': return 'Concluída';
      default: return '';
    }
  }
}
