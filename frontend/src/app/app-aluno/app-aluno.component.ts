import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlunoDashboardComponent } from './app-aluno-dashboard.component';
import { AlunoReservaComponent } from './app-aluno-reserva.component';
import { AlunoQrcodeComponent } from './app-aluno-qrcode.component';
import { AlunoRastreamentoComponent } from './app-aluno-rastreamento.component';
import { AlunoNotificacoesComponent } from './app-aluno-notificacoes.component';
import { AlunoPerfilComponent } from './app-aluno-perfil.component';

type Screen = 'dashboard' | 'reserva' | 'qrcode' | 'rastreamento' | 'notificacoes' | 'perfil';

interface Notificacao {
  id: number;
  tipo: 'info' | 'alerta' | 'atraso';
  mensagem: string;
  lida: boolean;
  horario: string;
  detalhes: string;
}

interface Rota {
  id: string;
  nome: string;
  ocupacao: number;
  disponivel: boolean;
}

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, AlunoDashboardComponent, AlunoReservaComponent, AlunoQrcodeComponent, AlunoRastreamentoComponent, AlunoNotificacoesComponent, AlunoPerfilComponent],
  templateUrl: './app-aluno.component.html',
  styleUrl: './app-aluno.component.css'
})
export class AppAlunoComponent {
  currentScreen = signal<Screen>('dashboard');
  presencaConfirmada = signal(false);
  dataSelecionada = signal('');
  rotaSelecionada = signal('');

  user: any;

  notificacoes = signal<Notificacao[]>([
    { id: 1, tipo: 'info', mensagem: 'Sua reserva para amanhã foi confirmada', lida: false, horario: '10:30', detalhes: 'Rota: Centro-Campus às 07:30. Ponto de embarque: Terminal Central.' },
    { id: 2, tipo: 'alerta', mensagem: 'Ônibus próximo do horário de saída', lida: false, horario: '09:15', detalhes: 'O ônibus da rota Centro-Campus partirá em 10 minutos. Dirija-se ao ponto de embarque.' },
    { id: 3, tipo: 'atraso', mensagem: 'Ônibus com 5 minutos de atraso', lida: true, horario: 'Ontem', detalhes: 'Devido ao tráfego, o ônibus está com um pequeno atraso.' },
    { id: 4, tipo: 'info', mensagem: 'Nova rota disponível: Bairro D-Campus', lida: true, horario: '2 dias atrás', detalhes: 'Nova rota disponível.' }
  ]);

  rotasDisponiveis: Rota[] = [
    { id: 'centro', nome: 'Centro-Campus (07:30)', ocupacao: 68, disponivel: true },
    { id: 'bairroA', nome: 'Bairro A-Campus (07:45)', ocupacao: 85, disponivel: true },
    { id: 'bairroB', nome: 'Bairro B-Campus (08:00)', ocupacao: 92, disponivel: true },
    { id: 'terminal', nome: 'Terminal-Campus (08:30)', ocupacao: 95, disponivel: false }
  ];

  notifSelecionada = signal<Notificacao | null>(null);

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

  getRotaInfo() {
    return this.rotasDisponiveis.find(r => r.id === this.rotaSelecionada());
  }

  getNotificacoesNaoLidas() {
    return this.notificacoes().filter(n => !n.lida).length;
  }

  setScreen(screen: Screen): void {
    this.currentScreen.set(screen);
  }

  logout(): void {
    this.authService.logout();
  }
}