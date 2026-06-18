import { Component } from '@angular/core';
import { MotoristaService } from '../services/motorista.service';
import { AuthService } from '../services/auth.service';
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
  selector: 'app-motorista-notificacoes',
  standalone: true,
  imports: [],
  templateUrl: './app-motorista-notificacoes.component.html',
  styleUrl: './app-motorista-notificacoes.component.css'
})
export class AppMotoristaNotificacoesComponent {
  notificacoes: Notificacao[] = [];
  userId: number | null = null;

  constructor(private motoristaService: MotoristaService, private authService: AuthService) {
    const user = this.authService.user();
    if (user) {
      this.userId = user.id;
      // In a real app, we would fetch notifications from the backend
      // For now, we'll use mock data
      this.notificacoes = [
        { id: 1, tipo: 'info', mensagem: 'Próxima viagem agendada para amanhã às 06:30', lida: false, horario: '10:30', detalhes: 'Rota: Centro-Campus' },
        { id: 2, tipo: 'alerta', mensagem: 'Veículo necessita de manutenção', lida: false, horario: '09:15', detalhes: 'Verificar pneus e óleo' },
        { id: 3, tipo: 'atraso', mensagem: 'Viagem atrasada devido ao tráfego', lida: true, horario: 'Ontem', detalhes: 'Atraso de 10 minutos' }
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