import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';

export interface Notificacao {
  id: number;
  tipo: 'info' | 'alerta' | 'atraso' | 'confirmacao';
  titulo: string;
  mensagem: string;
  lida: boolean;
  horario: string;
}

@Component({
  selector: 'app-aluno-notificacoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-notificacoes.component.html',
  styleUrl: './app-aluno-notificacoes.component.css'
})
export class AppAlunoNotificacoesComponent implements OnInit {
  private alunoService = inject(AlunoService);
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
    // TODO: substituir por endpoint backend real
    // Mock data for demo
    setTimeout(() => {
      this.notificacoes.set([
        { id: 1, tipo: 'confirmacao', titulo: 'Reserva Confirmada', mensagem: 'Sua reserva para amanhã foi confirmada', lida: false, horario: '10:30' },
        { id: 2, tipo: 'info', titulo: 'Embarque Próximo', mensagem: 'Ônibus próximo do horário de saída', lida: false, horario: '09:15' },
        { id: 3, tipo: 'atraso', titulo: 'Atraso', mensagem: 'Ônibus com 5 minutos de atraso', lida: true, horario: '08:45' },
        { id: 4, tipo: 'info', titulo: 'Nova Rota', mensagem: 'Nova rota disponível: Bairro D-Campus', lida: true, horario: 'Ontem' }
      ]);
      this.isLoading.set(false);
    }, 500);
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
    this.notificacoes.update(notifs =>
      notifs.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  }
}