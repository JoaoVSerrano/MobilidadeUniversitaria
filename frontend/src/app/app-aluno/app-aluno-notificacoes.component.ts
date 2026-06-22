import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';

export interface Notificacao {
  id: number;
  tipo: 'info' | 'alerta' | 'atraso' | 'confirmacao';
  titulo: string;
  mensagem: string;
  lida: boolean;
  horario: string;
  acao?: string;
  acaoUrl?: string;
}

@Component({
  selector: 'app-aluno-notificacoes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-aluno-notificacoes.component.html',
  styleUrl: './app-aluno-notificacoes.component.css'
})
export class AppAlunoNotificacoesComponent implements OnInit, OnDestroy {
  private alunoService = inject(AlunoService);
  private authService = inject(AuthService);
  private refreshHandle?: ReturnType<typeof setInterval>;

  notificacoes = signal<Notificacao[]>([]);
  isLoading = signal(true);

  naoLidasCount = computed(() => this.notificacoes().filter(n => !n.lida).length);

  ngOnInit() {
    this.carregarNotificacoes();
    this.refreshHandle = setInterval(() => this.carregarNotificacoes(), 15000);
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) clearInterval(this.refreshHandle);
  }

  carregarNotificacoes() {
    this.isLoading.set(true);
    this.alunoService.getNotificacoes().subscribe({
      next: (data) => {
        const notificacoesMapeadas = data.map(n => ({
          id: n.id,
          tipo: this.mapearTipo(n.tipoNotificacao),
          titulo: this.mapearTitulo(n.tipoNotificacao),
          mensagem: n.mensagem,
          lida: n.lida,
          horario: this.formatarHorario(n.dataHoraEnvio),
          acao: n.acao,
          acaoUrl: n.acaoUrl
        }));
        this.notificacoes.set(notificacoesMapeadas);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificacoes.set([]);
        this.isLoading.set(false);
      }
    });
  }

  mapearTipo(tipoBackend: string): 'info' | 'alerta' | 'atraso' | 'confirmacao' {
    const tipoMap: Record<string, 'info' | 'alerta' | 'atraso' | 'confirmacao'> = {
      'NOVA_VIAGEM': 'info',
      'RESERVA_CONFIRMADA': 'confirmacao',
      'VIAGEM_INICIADA': 'alerta',
      'EMBARQUE_PROXIMO': 'info',
      'ATRASO': 'atraso',
      'CANCELAMENTO': 'alerta',
      'INFO': 'info',
      'ALERTA': 'alerta'
    };
    return tipoMap[tipoBackend] || 'info';
  }

  mapearTitulo(tipoBackend: string): string {
    const tituloMap: Record<string, string> = {
      'NOVA_VIAGEM': 'Nova Viagem',
      'RESERVA_CONFIRMADA': 'Reserva Confirmada',
      'VIAGEM_INICIADA': 'Viagem Iniciada',
      'EMBARQUE_PROXIMO': 'Embarque Próximo',
      'ATRASO': 'Atraso',
      'CANCELAMENTO': 'Cancelamento',
      'INFO': 'Informação',
      'ALERTA': 'Alerta'
    };
    return tituloMap[tipoBackend] || 'Notificação';
  }

  formatarHorario(dataHora: string): string {
    if (!dataHora) return '';
    const data = new Date(dataHora);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin} min atrás`;
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias === 1) return 'Ontem';
    if (diffDias < 7) return `${diffDias} dias atrás`;
    return data.toLocaleDateString('pt-BR');
  }

  getNotificationIcon(tipo: string): string {
    switch (tipo) {
      case 'alerta':
        return `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`;
      case 'atraso':
        return `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`;
      case 'confirmacao':
        return `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>`;
      default:
        return `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>`;
    }
  }

  getNotificationIconClass(tipo: string): string {
    switch (tipo) {
      case 'alerta': return 'icon-warning';
      case 'atraso': return 'icon-delay';
      case 'confirmacao': return 'icon-success';
      default: return 'icon-info';
    }
  }

  deletarNotificacao(id: number): void {
    this.notificacoes.update(notifs => notifs.filter(n => n.id !== id));
  }

  marcarComoLida(id: number): void {
    this.alunoService.marcarNotificacaoLida(id).subscribe({
      next: () => {
        this.notificacoes.update(notifs =>
          notifs.map(n => n.id === id ? { ...n, lida: true } : n)
        );
      },
      error: () => {}
    });
  }
}
