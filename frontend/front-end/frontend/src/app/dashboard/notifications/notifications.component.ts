import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  // Form fields
  recipient: string = 'Todos os Alunos';
  type: 'info' | 'alerta' | 'sucesso' = 'info';
  title: string = '';
  message: string = '';

  // Alert message / toast
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';

  // History List
  history: NotificationHistoryItem[] = [
    {
      id: 1,
      title: 'Alteração de rota',
      recipient: 'Alunos - Rota Centro',
      type: 'alerta',
      time: 'Hoje às 14:30',
      message: 'A rota Centro terá alteração nos pontos de parada devido a obras na Av. Central.'
    },
    {
      id: 2,
      title: 'Manutenção programada',
      recipient: 'Todos',
      type: 'info',
      time: 'Ontem às 09:15',
      message: 'O veículo BUS-003 passará por manutenção preventiva programada.'
    },
    {
      id: 3,
      title: 'Nova rota disponível',
      recipient: 'Todos os Alunos',
      type: 'info',
      time: '2 dias atrás',
      message: 'Uma nova rota ligando o Bairro C ao Campus está disponível para reservas.'
    }
  ];

  sendNotification() {
    if (!this.title.trim() || !this.message.trim()) {
      this.showToast('Por favor, preencha todos os campos da notificação.', 'error');
      return;
    }

    const newNotification: NotificationHistoryItem = {
      id: Date.now(),
      title: this.title,
      recipient: this.recipient,
      type: this.type,
      time: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      message: this.message
    };

    // Add to top of list
    this.history.unshift(newNotification);

    // Show feedback
    this.showToast('Notificação enviada com sucesso!', 'success');

    // Reset form
    this.title = '';
    this.message = '';
    this.recipient = 'Todos os Alunos';
    this.type = 'info';
  }

  showToast(msg: string, type: 'success' | 'error') {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 4000);
  }
}
