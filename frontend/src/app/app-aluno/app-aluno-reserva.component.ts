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
  viagemId?: number;
  dataHoraPartida?: string;
  capacidade?: number;
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

  hoje = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.isLoading.set(true);
    // Buscar viagens agendadas diretamente
    this.http.get<any[]>(`${this.baseUrl}/viagens`).subscribe({
      next: (data) => {
        // Filtrar apenas viagens AGENDADAS
        const viagensDisp = data.filter(v => v.status === 'AGENDADA');
        // Extrair rotas únicas das viagens disponíveis
        const rotasMap = new Map<number, any>();
        viagensDisp.forEach(v => {
          if (v.rota && !rotasMap.has(v.rota.id)) {
            rotasMap.set(v.rota.id, {
              ...v.rota,
              viagemId: v.id,
              dataHoraPartida: v.dataHoraPartida,
              capacidade: v.veiculo?.capacidadeTotal || 45
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

  // DEMO: ocupação simulada baseada no id da rota (substituir por API real em produção)
  getOcupacao(rota: RotaDisponivel): number {
    const seed = rota.id * 37 % 100;
    return Math.min(seed + 40, 100);
  }

  // DEMO: horário simulado baseado no id da rota (substituir por API real em produção)
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
