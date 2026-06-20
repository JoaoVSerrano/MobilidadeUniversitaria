import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';

interface Viagem {
  id: number;
  origem: string;
  destino: string;
  horario: string;
  data: string;
  status: string;
}

interface Notificacao {
  id: number;
  mensagem: string;
  horario: string;
  lida: boolean;
}

@Component({
  selector: 'app-aluno-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-dashboard.component.html',
  styleUrl: './app-aluno-dashboard.component.css'
})
export class AppAlunoDashboardComponent implements OnInit {
  private alunoService = inject(AlunoService);
  private authService = inject(AuthService);

  user = this.authService.user;
  isLoading = signal(true);
  proximaViagem = signal<Viagem | null>(null);
  notificacoesRecentes = signal<Notificacao[]>([]);

  ngOnInit(): void {
    const user = this.user();
    if (!user) return;

    // Carregar próxima viagem
    this.alunoService.getViagensByAlunoId(user.id).subscribe({
      next: (viagens: any[]) => {
        const proxima = viagens.find((v: any) =>
          v.status === 'AGENDADA' || v.status === 'EM_ANDAMENTO'
        );
        if (proxima) {
          this.proximaViagem.set({
            id: proxima.id,
            origem: proxima.rota?.pontoParada?.split(' → ')[0] || 'Centro',
            destino: proxima.rota?.pontoParada?.split(' → ')[1] || 'Campus',
            horario: proxima.dataHoraPartida
              ? new Date(proxima.dataHoraPartida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : '—',
            data: proxima.dataHoraPartida
              ? new Date(proxima.dataHoraPartida).toLocaleDateString('pt-BR')
              : '—',
            status: proxima.status || '—'
          });
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });

    // Carregar notificações recentes (mock data for demo)
    this.notificacoesRecentes.set([
      { id: 1, mensagem: 'Sua reserva para amanhã foi confirmada', horario: '10:30', lida: false },
      { id: 2, mensagem: 'Ônibus próximo do horário de saída', horario: '09:15', lida: true },
      { id: 3, mensagem: 'Ônibus com 5 minutos de atraso', horario: '08:45', lida: true }
    ]);
  }

  irParaReservas(): void {
    // Emitir evento ou usar router para navegar para reservas
    const event = new CustomEvent('navigate-to-reservas');
    window.dispatchEvent(event);
  }

  irParaNotificacoes(): void {
    // Emitir evento ou usar router para navegar para notificações
    const event = new CustomEvent('navigate-to-notificacoes');
    window.dispatchEvent(event);
  }
}