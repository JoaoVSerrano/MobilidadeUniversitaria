import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';

interface ViagemDisponivel {
  id: number;
  nomeRota: string;
  pontoParada: string;
  descricao: string;
  viagemId?: number;
  dataHoraPartida?: string;
  capacidade?: number;
  status?: string;
}

interface ReservaAluno {
  viagemId: number;
  rotaNome: string;
  dataHoraPartida: string;
  status: string;
  confirmada: boolean;
}

@Component({
  selector: 'app-aluno-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-aluno-reserva.component.html',
  styleUrl: './app-aluno-reserva.component.css'
})
export class AppAlunoReservaComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private alunoService = inject(AlunoService);
  private authService = inject(AuthService);
  private baseUrl = environment.apiUrl;
  private refreshHandle?: ReturnType<typeof setInterval>;

  dataSelecionada = '';
  rotaSelecionada = '';
  rotas = signal<ViagemDisponivel[]>([]);
  reservas = signal<ReservaAluno[]>([]);
  isLoading = signal(false);
  mensagem = signal('');
  mensagemTipo = signal<'success' | 'error' | ''>('');

  // Real occupancy: map from viagemId -> { reservas, capacidade }
  ocupacaoMap = signal<Map<number, { reservas: number; capacidade: number }>>(new Map());

  hoje = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.carregarDados();
    this.refreshHandle = setInterval(() => this.carregarReservas(), 10000);
  }

  ngOnDestroy() {
    if (this.refreshHandle) clearInterval(this.refreshHandle);
  }

  private getAlunoId(): number | null {
    const user = this.authService.user();
    return user?.id ?? null;
  }

  carregarDados(): void {
    this.carregarReservas();
    this.carregarRotas();
  }

  // Load student's reservations via /student/presencas (reliable, no JPA join issue)
  carregarReservas(): void {
    this.http.get<any[]>(`${this.baseUrl}/student/presencas`).subscribe({
      next: (presencas) => {
        this.reservas.set(presencas.map(p => ({
          viagemId: Number(p.viagemId),
          rotaNome: 'Viagem #' + p.viagemId,
          dataHoraPartida: '',
          status: p.status || 'RESERVADA',
          confirmada: p.status === 'CONFIRMADA'
        })));
        // Enrich with trip info
        presencas.forEach(p => {
          this.http.get<any>(`${this.baseUrl}/viagens/${p.viagemId}`).subscribe({
            next: (v) => {
              this.reservas.update(rs => rs.map(r =>
                r.viagemId === p.viagemId
                  ? { ...r, rotaNome: v.rota?.nomeRota || 'Viagem #' + v.id, dataHoraPartida: v.dataHoraPartida || '' }
                  : r
              ));
            }
          });
        });
      },
      error: () => this.reservas.set([])
    });
  }

  carregarRotas(): void {
    this.isLoading.set(true);
    this.http.get<any[]>(`${this.baseUrl}/viagens`).subscribe({
      next: (data) => {
        const viagensDisp = data.filter(v => v.status === 'AGENDADA');
        const novaOcupacaoMap = new Map<number, { reservas: number; capacidade: number }>();

        const rotasMap = new Map<number, any>();
        viagensDisp.forEach(v => {
          const capacidade = v.veiculo?.capacidadeTotal || 45;
          // Fetch real occupancy per trip
          this.http.get<any>(`${this.baseUrl}/viagens/${v.id}/occupancy`).subscribe({
            next: (occ) => {
              novaOcupacaoMap.set(v.id, { reservas: Number(occ.reservas ?? 0), capacidade: Number(occ.capacidade ?? capacidade) });
              this.ocupacaoMap.set(new Map(novaOcupacaoMap));
            },
            error: () => {
              novaOcupacaoMap.set(v.id, { reservas: 0, capacidade });
              this.ocupacaoMap.set(new Map(novaOcupacaoMap));
            }
          });

          if (v.rota && !rotasMap.has(v.rota.id)) {
            rotasMap.set(v.rota.id, {
              ...v.rota,
              viagemId: v.id,
              dataHoraPartida: v.dataHoraPartida,
              capacidade,
              status: v.status
            });
          }
        });
        this.rotas.set(Array.from(rotasMap.values()));
        this.isLoading.set(false);
      },
      error: () => { this.isLoading.set(false); }
    });
  }

  selecionarRota(id: string) {
    this.rotaSelecionada = this.rotaSelecionada === id ? '' : id;
  }

  reservar() {
    if (!this.rotaSelecionada) {
      this.mensagem.set('Selecione uma rota.');
      this.mensagemTipo.set('error');
      return;
    }

    const rotaObj = this.rotas().find(r => r.id.toString() === this.rotaSelecionada);
    if (!rotaObj?.viagemId) {
      this.mensagem.set('Viagem não encontrada para esta rota.');
      this.mensagemTipo.set('error');
      return;
    }

    this.isLoading.set(true);
    this.http.post(`${this.baseUrl}/student/trips/${rotaObj.viagemId}/reserve`, {}).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.mensagem.set(`Reserva confirmada para ${rotaObj.nomeRota}!`);
        this.mensagemTipo.set('success');
        this.rotaSelecionada = '';
        this.carregarDados();
        window.dispatchEvent(new CustomEvent('student-reservation-updated'));
        setTimeout(() => this.mensagem.set(''), 4000);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const msg = err.error?.message || '';
        if (msg.includes('ja possui reserva')) {
          this.mensagem.set('Você já tem uma reserva para esta viagem.');
        } else {
          this.mensagem.set(msg || 'Erro ao confirmar reserva.');
        }
        this.mensagemTipo.set('error');
      }
    });
  }

  getOcupacao(rota: ViagemDisponivel): number {
    const occ = this.ocupacaoMap().get(rota.viagemId ?? rota.id);
    if (!occ || occ.capacidade === 0) return 0;
    return Math.round((occ.reservas / occ.capacidade) * 100);
  }

  getHorario(rota: ViagemDisponivel): string {
    if (rota.dataHoraPartida) {
      return new Date(rota.dataHoraPartida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return '--:--';
  }

  formatarDataHora(dataHora: string): string {
    if (!dataHora) return '—';
    const data = new Date(dataHora);
    return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  getOcupacaoColor(percent: number): string {
    if (percent >= 100) return '#ef4444';
    if (percent >= 85)  return '#f59e0b';
    if (percent >= 60)  return '#eab308';
    return '#22c55e';
  }
}
