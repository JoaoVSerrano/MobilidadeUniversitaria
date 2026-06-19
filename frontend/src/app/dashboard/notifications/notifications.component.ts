import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';

interface NotificationHistoryItem {
  id: number;
  title: string;
  recipient: string;
  type: 'info' | 'alerta' | 'sucesso';
  time: string;
  message?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  private svc = inject(DashboardService);

  recipient = 'Todos os Alunos';
  type: 'info' | 'alerta' | 'sucesso' = 'info';
  title = '';
  message = '';

  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  history: NotificationHistoryItem[] = [
    { id: 1, title: 'Alteração de rota', recipient: 'Alunos - Rota Centro', type: 'alerta', time: 'Hoje às 14:30', message: 'A rota Centro terá alteração nos pontos de parada.' },
    { id: 2, title: 'Manutenção programada', recipient: 'Todos', type: 'info', time: 'Ontem às 09:15', message: 'O veículo BUS-003 pasará por manutenção.' },
    { id: 3, title: 'Nova rota disponível', recipient: 'Todos os Alunos', type: 'info', time: '2 dias atrás', message: 'Uma nova rota está disponível.' }
  ];

  sendNotification() {
    if (!this.title.trim() || !this.message.trim()) {
      this.showToast('Por favor, preencha todos os campos.', 'error');
      return;
    }

    const destinatarios = this.recipient === 'Todos os Alunos' ? 'alunos'
      : this.recipient === 'Todos os Motoristas' ? 'motoristas'
      : 'alunos';

    this.svc.sendNotification({
      destinatarios,
      tipo: this.type,
      titulo: this.title,
      mensagem: this.message
    }).subscribe({
      next: () => {
        this.history.unshift({
          id: Date.now(),
          title: this.title,
          recipient: this.recipient,
          type: this.type,
          time: 'Agora às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          message: this.message
        });
        this.showToast('Notificação enviada!', 'success');
        this.title = '';
        this.message = '';
      },
      error: () => {
        this.history.unshift({
          id: Date.now(),
          title: this.title,
          recipient: this.recipient,
          type: this.type,
          time: 'Agora',
          message: this.message
        });
        this.showToast('Notificação registrada localmente.', 'success');
        this.title = '';
        this.message = '';
      }
    });
  }

  showToast(msg: string, type: 'success' | 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}