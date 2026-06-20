import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface RotaDisponivel {
  id: number;
  nomeRota: string;
  pontoParada: string;
  descricao: string;
}

@Component({
  selector: 'app-aluno-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-aluno-reserva.component.html',
  styleUrl: './app-aluno-reserva.component.css'
})
export class AppAlunoReservaComponent implements OnInit {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  dataSelecionada = '';
  rotaSelecionada = '';
  rotas = signal<RotaDisponivel[]>([]);
  isLoading = signal(false);
  mensagem = signal('');
  mensagemTipo = signal<'success' | 'error' | ''>('');

  // Data mínima = hoje
  hoje = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.http.get<RotaDisponivel[]>(`${this.baseUrl}/rotas`).subscribe({
      next: (data) => this.rotas.set(data),
      error: () => this.rotas.set([])
    });
  }

  selecionarRota(id: string) {
    this.rotaSelecionada = this.rotaSelecionada === id ? '' : id;
  }

  reservar() {
    if (!this.dataSelecionada || !this.rotaSelecionada) {
      this.mensagem.set('Selecione a data e a rota.');
      this.mensagemTipo.set('error');
      return;
    }

    this.isLoading.set(true);

    // 1. Buscar viagens disponíveis para a rota selecionada na data
    this.http.get<any[]>(`${this.baseUrl}/viagens`).subscribe({
      next: (viagens) => {
        const rotaId = Number(this.rotaSelecionada);
        const dataAlvo = this.dataSelecionada; // YYYY-MM-DD

        // Encontrar viagem da rota na data selecionada com status AGENDADA
        const viagem = viagens.find(v => {
          const viagemData = v.dataHoraPartida
            ? new Date(v.dataHoraPartida).toISOString().split('T')[0]
            : null;
          return v.rota?.id === rotaId
            && viagemData === dataAlvo
            && v.status === 'AGENDADA';
        });

        if (!viagem) {
          // Tentar o endpoint de confirmação direto como fallback
          this.http.post(`${this.baseUrl}/student/trips/confirm`, {
            rotaId,
            data: this.dataSelecionada
          }).subscribe({
            next: () => {
              this.isLoading.set(false);
              this.mensagem.set('Reserva confirmada com sucesso!');
              this.mensagemTipo.set('success');
              this.dataSelecionada = '';
              this.rotaSelecionada = '';
              setTimeout(() => this.mensagem.set(''), 4000);
            },
            error: () => {
              this.isLoading.set(false);
              this.mensagem.set('Não há viagem disponível para essa rota e data. Tente outra data.');
              this.mensagemTipo.set('error');
            }
          });
          return;
        }

        // 2. Registrar presença via POST /api/presencas
        // O aluno logado usa POST /api/student/trips/{viagemId}/reserve
        this.http.post(`${this.baseUrl}/student/trips/${viagem.id}/reserve`, {}).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.mensagem.set(`Reserva confirmada para a viagem de ${viagem.rota?.nomeRota}!`);
            this.mensagemTipo.set('success');
            this.dataSelecionada = '';
            this.rotaSelecionada = '';
            setTimeout(() => this.mensagem.set(''), 4000);
          },
          error: (err: any) => {
            this.isLoading.set(false);
            this.mensagem.set(err.error?.message || 'Erro ao confirmar reserva.');
            this.mensagemTipo.set('error');
          }
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.mensagem.set('Erro ao buscar viagens disponíveis.');
        this.mensagemTipo.set('error');
      }
    });
  }

  // Simula ocupação baseada no id da rota para demonstração visual
  getOcupacao(rota: RotaDisponivel): number {
    const seed = rota.id * 37 % 100;
    return Math.min(seed + 40, 100);
  }

  // Simula horário baseado no índice da rota
  getHorario(rota: RotaDisponivel): string {
    const horas = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00'];
    return horas[rota.id % horas.length];
  }

  getOcupacaoColor(percent: number): string {
    if (percent >= 100) return '#ef4444';
    if (percent >= 85)  return '#f59e0b';
    if (percent >= 60)  return '#eab308';
    return '#22c55e';
  }
}