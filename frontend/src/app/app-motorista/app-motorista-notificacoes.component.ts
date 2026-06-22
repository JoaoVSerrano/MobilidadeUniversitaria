import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MotoristaService } from '../services/motorista.service';
import { AuthService } from '../services/auth.service';

export interface Notificacao {
  id: number;
  tipo: 'info' | 'alerta' | 'atraso' | 'confirmacao';
  titulo: string;
  mensagem: string;
  lida: boolean;
  horario: string;
  detalhes?: string;
  acao?: string;
  acaoUrl?: string;
}

@Component({
  selector: 'app-motorista-notificacoes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-motorista-notificacoes.component.html',
  styleUrl: './app-motorista-notificacoes.component.css'
})
export class AppMotoristaNotificacoesComponent implements OnInit {
  private motoristaService = inject(MotoristaService);
  private authService = inject(AuthService);

  notificacoes = signal<Notificacao[]>([]);
  isLoading = signal(true);

  naoLidasCount = computed(() => {
    return this.notificacoes().filter(n => !n.lida).length;
  });

  ngOnInit() {
    this.carregarNotificacoes();
  }

  carregarNotificacoes() {
    this.isLoading.set(true);
    this.motoristaService.getNotificacoesMotorista().subscribe({
      next: (data) => {
        const notificacoesMapeadas = data.map(n => ({
          id: n.id,
          tipo: this.mapearTipo(n.tipoNotificacao),
          titulo: this.mapearTitulo(n.tipoNotificacao),
          mensagem: n.mensagem,
          lida: n.lida,
          horario: this.formatarHorario(n.dataHoraEnvio),
          detalhes: n.viagemId ? `Viagem ID: ${n.viagemId}` : undefined,
          acao: n.acao,
          acaoUrl: n.acaoUrl
        }));
        this.notificacoes.set(notificacoesMapeadas);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar notificações:', err);
        this.notificacoes.set([]);
        this.isLoading.set(false);
      }
    });
  }

  mapearTipo(tipoBackend: string): 'info' | 'alerta' | 'atraso' | 'confirmacao' {
    const tipoMap: Record<string, 'info' | 'alerta' | 'atraso' | 'confirmacao'> = {
      'VIAGEM_DESIGNADA': 'confirmacao',
      'VIAGEM_ATUALIZADA': 'info',
      'VIAGEM_INICIADA': 'info',
      'VIAGEM_CANCELADA': 'alerta',
      'VIAGEM_ATRASADA': 'atraso',
      'INFO': 'info',
      'ALERTA': 'alerta'
    };
    return tipoMap[tipoBackend] || 'info';
  }

  mapearTitulo(tipoBackend: string): string {
    const tituloMap: Record<string, string> = {
      'VIAGEM_DESIGNADA': 'Viagem Designada',
      'VIAGEM_ATUALIZADA': 'Viagem Atualizada',
      'VIAGEM_INICIADA': 'Viagem em Curso',
      'VIAGEM_CANCELADA': 'Viagem Cancelada',
      'VIAGEM_ATRASADA': 'Viagem Atrasada',
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
    this.motoristaService.marcarNotificacaoMotoristaLida(id).subscribe({
      next: () => {
        this.notificacoes.update(notifs =>
          notifs.map(n => n.id === id ? { ...n, lida: true } : n)
        );
      },
      error: (err) => {
        console.error('Erro ao marcar notificação como lida:', err);
      }
    });
  }
}