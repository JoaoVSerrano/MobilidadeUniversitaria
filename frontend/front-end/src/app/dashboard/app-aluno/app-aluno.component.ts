import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavigationService } from '../services/navigation.service';

interface AlunoRoute {
  id: number;
  name: string;
  time: string;
  occupancy: number;
  reserved: boolean;
  status?: string;
}

interface AlunoNotification {
  id: number;
  title: string;
  time: string;
  icon: 'bell' | 'alert' | 'clock';
  unread: boolean;
}

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-aluno.component.html',
  styleUrl: './app-aluno.component.css'
})
export class AppAlunoComponent implements OnInit, OnDestroy {
  private navSvc = inject(NavigationService);
  
  currentTab: 'home' | 'reservas' | 'qrcode' | 'notificacoes' | 'perfil' = 'home';
  private sub = new Subscription();

  // Profile data
  studentName: string = 'João Silva';
  studentEmail: string = 'joao.silva@email.com';
  studentPhone: string = '(11) 98765-4321';
  studentMatricula: string = '2024001234';

  // State flags
  toastMessage: string | null = null;
  qrLoading: boolean = false;
  qrCodeSeed: number = 1;

  // Selected reservation date
  selectedDate: string = '';

  // App Aluno list of routes
  routes: AlunoRoute[] = [
    { id: 1, name: 'Centro-Campus', time: '07:30', occupancy: 68, reserved: true },
    { id: 2, name: 'Bairro A-Campus', time: '07:45', occupancy: 85, reserved: false },
    { id: 3, name: 'Bairro B-Campus', time: '08:00', occupancy: 92, reserved: false },
    { id: 4, name: 'Terminal-Campus', time: '08:30', occupancy: 100, reserved: false, status: 'Lotado' }
  ];

  // App Aluno notifications
  notifications: AlunoNotification[] = [
    { id: 1, title: 'Sua reserva para amanhã foi confirmada', time: '10:30', icon: 'bell', unread: true },
    { id: 2, title: 'Ônibus próximo do horário de saída', time: '09:15', icon: 'alert', unread: true },
    { id: 3, title: 'Ônibus com 5 minutos de atraso', time: 'Ontem', icon: 'clock', unread: false },
    { id: 4, title: 'Nova rota disponível: Bairro D-Campus', time: '2 dias atrás', icon: 'bell', unread: false }
  ];

  ngOnInit() {
    this.sub.add(
      this.navSvc.alunoTab$.subscribe(tab => {
        this.selectTab(tab);
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  get activeReservation(): AlunoRoute | undefined {
    return this.routes.find(r => r.reserved);
  }

  selectTab(tab: 'home' | 'reservas' | 'qrcode' | 'notificacoes' | 'perfil') {
    this.currentTab = tab;
    // When opening notifications, mark them as read
    if (tab === 'notificacoes') {
      this.notifications.forEach(n => n.unread = false);
    }
  }

  // Action handlers
  reservarPresenca() {
    this.selectTab('reservas');
  }

  toggleRouteReservation(route: AlunoRoute) {
    if (route.status === 'Lotado') {
      this.showToast('Esta rota está lotada no momento.');
      return;
    }

    if (route.reserved) {
      // Cancel
      route.reserved = false;
      route.occupancy = Math.max(0, route.occupancy - 1);
      this.showToast('Reserva cancelada com sucesso!');
    } else {
      // Clear previous reservations first (only one active)
      this.routes.forEach(r => {
        if (r.reserved) {
          r.reserved = false;
          r.occupancy = Math.max(0, r.occupancy - 1);
        }
      });
      // Reserve new
      route.reserved = true;
      route.occupancy = Math.min(100, route.occupancy + 1);
      this.showToast(`Reserva confirmada para ${route.name} às ${route.time}!`);
    }
  }

  deleteNotification(id: number, event: Event) {
    event.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.showToast('Notificação excluída.');
  }

  atualizarQrCode() {
    this.qrLoading = true;
    setTimeout(() => {
      this.qrLoading = false;
      this.qrCodeSeed = Math.random();
      this.showToast('QR Code atualizado com sucesso!');
    }, 800);
  }

  salvarPerfil() {
    if (!this.studentName.trim() || !this.studentEmail.trim() || !this.studentPhone.trim()) {
      this.showToast('Preencha todos os campos obrigatórios.');
      return;
    }
    this.showToast('Alterações salvas com sucesso!');
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 2500);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length === 0 || !parts[0]) return 'JS';
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }
}
