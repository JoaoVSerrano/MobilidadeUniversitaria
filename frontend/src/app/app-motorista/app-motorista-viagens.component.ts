import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Presenca {
  id: number;
  alunoId: number;
  alunoNome: string;
  status: string;
  confirmada: boolean;
}

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

  selectedViagem = signal<any | null>(null);
  presencas = signal<Presenca[]>([]);
  showStudentsList = signal(false);
  isLoadingPresencas = signal(false);
  paradaAtual = signal<number>(0);

  ngOnInit() {
    this.http.get<any[]>(`${this.baseUrl}/driver/trips/today`).subscribe({
      next: (data) => { this.viagens.set(data); this.isLoading.set(false); },
      error: (err: any) => {
        this.erro.set(err.error?.message || 'Erro ao carregar viagens.');
        this.isLoading.set(false);
      }
    });
  }

  atualizarParada(viagemId: number, novoIndex: number) {
    this.http.put<any>(`${this.baseUrl}/driver/trips/${viagemId}/parada`, { novaParadaIndex: novoIndex }).subscribe({
      next: (updated) => {
        this.viagens.update(vs => vs.map(v => v.id === viagemId ? updated : v));
        this.paradaAtual.set(novoIndex);
      },
      error: (err: any) => this.erro.set(err.error?.message || 'Erro ao atualizar parada.')
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

  verAlunos(viagem: any) {
    this.erro.set('');
    this.selectedViagem.set(viagem);
    this.showStudentsList.set(true);
    this.isLoadingPresencas.set(true);

    this.http.get<Presenca[]>(`${this.baseUrl}/driver/trips/${viagem.id}/students`).subscribe({
      next: (data) => {
        this.presencas.set(data);
        this.isLoadingPresencas.set(false);
      },
      error: (err: any) => {
        this.erro.set(err.error?.message || 'Erro ao carregar lista de alunos.');
        this.isLoadingPresencas.set(false);
      }
    });
  }

  fecharListaAlunos() {
    this.showStudentsList.set(false);
    this.selectedViagem.set(null);
    this.presencas.set([]);
  }

  confirmarPresenca(presencaId: number) {
    this.erro.set('');
    this.http.post<any>(`${this.baseUrl}/presencas/${presencaId}/confirmar`, {}).subscribe({
      next: () => {
        this.presencas.update(ps => ps.map(p =>
          p.id === presencaId
            ? { ...p, confirmada: true, status: 'CONFIRMADA' }
            : p
        ));
      },
      error: (err: any) => {
        this.erro.set(err.error?.message || 'Erro ao confirmar presença.');
      }
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
