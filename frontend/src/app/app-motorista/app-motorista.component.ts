import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MotoristaDashboardComponent } from './app-motorista-dashboard.component';
import { MotoristaViagensComponent } from './app-motorista-viagens/app-motorista-viagens.component';
import { MotoristaQrComponent } from './app-motorista-qr/app-motorista-qr.component';
import { MotoristaNotificacoesComponent } from './app-motorista-notificacoes/app-motorista-notificacoes.component';
import { MotoristaPerfilComponent } from './app-motorista-perfil/app-motorista-perfil.component';

type Screen = 'dashboard' | 'viagens' | 'qr' | 'notificacoes' | 'perfil';

interface Notificacao {
  id: number;
  tipo: 'info' | 'alerta' | 'atraso';
  mensagem: string;
  lida: boolean;
  horario: string;
  detalhes: string;
}

interface Viagem {
  id: number;
  rota: string;
  horario: string;
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA';
  passageiros: number;
  ocupacao: number;
}

@Component({
  selector: 'app-motorista',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, MotoristaDashboardComponent, MotoristaViagensComponent, MotoristaQrComponent, MotoristaNotificacoesComponent, MotoristaPerfilComponent],
  templateUrl: './app-motorista.component.html',
  styleUrl: './app-motorista.component.css'
})
export class AppMotoristaComponent {
  currentScreen = signal<Screen>('dashboard');
  user: any;

  notificacoes = signal<Notificacao[]>([
    { id: 1, tipo: 'info', mensagem: 'Próxima viagem agendada para amanhã às 06:30', lida: false, horario: '10:30', detalhes: 'Rota: Centro-Campus' },
    { id: 2, tipo: 'alerta', mensagem: 'Veículo necessita de manutenção', lida: false, horario: '09:15', detalhes: 'Verificar pneus e óleo' },
    { id: 3, tipo: 'atraso', mensagem: 'Viagem atrasada devido ao tráfego', lida: true, horario: 'Ontem', detalhes: 'Atraso de 10 minutos' }
  ]);

  viagens = signal<Viagem[]>([
    { id: 1, rota: 'Centro-Campus', horario: '06:30', status: 'AGENDADA', passageiros: 32, ocupacao: 71 },
    { id: 2, rota: 'Bairro-Campus', horario: '08:15', status: 'EM_ANDAMENTO', passageiros: 28, ocupacao: 70 },
    { id: 3, rota: 'Centro-Campus', horario: '12:00', status: 'FINALIZADA', passageiros: 45, ocupacao: 100 },
    { id: 4, rota: 'Bairro-Campus', horario: '15:30', status: 'CANCELADA', passageiros: 0, ocupacao: 0 }
  ]);

  constructor(private authService: AuthService) {
    this.user = this.authService.user;
  }

  getNotificationIcon(tipo: string): string {
    switch (tipo) {
      case 'alerta': return '⚠️';
      case 'atraso': return '⏰';
      default: return '🔔';
    }
  }

  deletarNotificacao(id: number): void {
    this.notificacoes.update(n => n.filter(nt => nt.id !== id));
  }

  getViagemStatusClass(status: string): string {
    switch (status) {
      case 'AGENDADA': return 'status-agendada';
      case 'EM_ANDAMENTO': return 'status-em-andamento';
      case 'FINALIZADA': return 'status-finalizada';
      case 'CANCELADA': return 'status-cancelada';
      default: return '';
    }
  }

  setScreen(screen: Screen): void {
    this.currentScreen.set(screen);
  }

  logout(): void {
    this.authService.logout();
  }
}