import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';

interface Viagem {
  id: number;
  data: string;
  rota: string;
  status: string;
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
  historicoViagens = signal<Viagem[]>([]);
  proximaViagem = signal<Viagem | null>(null);

  estatisticas = computed(() => {
    const viagens = this.historicoViagens();
    return {
      total: viagens.length,
      concluidas: viagens.filter(v => v.status === 'FINALIZADA').length,
      canceladas: viagens.filter(v => v.status === 'CANCELADA').length
    };
  });

  ngOnInit(): void {
    const user = this.user();
    if (!user) return;

    this.alunoService.getViagensByAlunoId(user.id).subscribe({
      next: (viagens: any[]) => {
        const mapped = viagens.slice(0, 5).map((v: any) => ({
          id: v.id,
          data: v.dataHoraPartida
            ? new Date(v.dataHoraPartida).toLocaleDateString('pt-BR')
            : '—',
          rota: v.rota?.nomeRota || '—',
          status: v.status || '—'
        }));

        this.historicoViagens.set(mapped);

        const proxima = viagens.find((v: any) =>
          v.status === 'AGENDADA' || v.status === 'EM_ANDAMENTO'
        );
        if (proxima) {
          this.proximaViagem.set({
            id: proxima.id,
            data: proxima.dataHoraPartida
              ? new Date(proxima.dataHoraPartida).toLocaleDateString('pt-BR')
              : '—',
            rota: proxima.rota?.nomeRota || '—',
            status: proxima.status || '—'
          });
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'FINALIZADA': return 'badge-success';
      case 'EM_ANDAMENTO': return 'badge-info';
      case 'CANCELADA': return 'badge-warning';
      default: return 'badge-info';
    }
  }
}