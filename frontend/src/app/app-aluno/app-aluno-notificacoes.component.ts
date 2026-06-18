import { Component } from '@angular/core';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

export interface Notificacao {
  id: number;
  tipo: 'info' | 'alerta' | 'atraso';
  mensagem: string;
  lida: boolean;
  horario: string;
  detalhes: string;
}

@Component({
  selector: 'app-aluno-notificacoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-notificacoes.component.html',
  styleUrl: './app-aluno-notificacoes.component.css'
})
export class AppAlunoNotificacoesComponent {
  notificacoes: Notificacao[] = [];
  userId: number | null = null;

  constructor(private alunoService: AlunoService, private authService: AuthService) {
    const user = this.authService.user();
    if (user) {
      this.userId = user.id;
      // In a real app, we would fetch notifications from the backend
      // For now, we'll use mock data
      this.notificacoes = [
        { id: 1, tipo: 'info', mensagem: 'Sua reserva para amanhã foi confirmada', lida: false, horario: '10:30', detalhes: 'Rota: Centro-Campus às 07:30. Ponto de embarque: Terminal Central.' },
        { id: 2, tipo: 'alerta', mensagem: 'Ônibus próximo do horário de saída', lida: false, horario: '09:15', detalhes: 'O ônibus da rota Centro-Campus partirá em 10 minutos. Dirija-se ao ponto de embarque.' },
        { id: 3, tipo: 'atraso', mensagem: 'Ônibus com 5 minutos de atraso', lida: true, horario: 'Ontem', detalhes: 'Devido ao tráfego, o ônibus está com um pequeno atraso.' },
        { id: 4, tipo: 'info', mensagem: 'Nova rota disponível: Bairro D-Campus', lida: true, horario: '2 dias atrás', detalhes: 'Nova rota disponível.' }
      ];
    }
  }

  getNotificationIcon(tipo: string): string {
    switch (tipo) {
      case 'alerta': return '⚠️';
      case 'atraso': return '⏰';
      default: return '🔔';
    }
  }

  deletarNotificacao(id: number): void {
    this.notificacoes = this.notificacoes.filter(nt => nt.id !== id);
  }

  marcarComoLida(id: number): void {
    const notif = this.notificacoes.find(n => n.id === id);
    if (notif) {
      notif.lida = true;
    }
  }
}