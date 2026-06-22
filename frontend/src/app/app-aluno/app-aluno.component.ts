import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AppAlunoDashboardComponent } from './app-aluno-dashboard.component';
import { AppAlunoReservaComponent } from './app-aluno-reserva.component';
import { AppAlunoQrcodeComponent } from './app-aluno-qrcode.component';
import { AppAlunoRastreamentoComponent } from './app-aluno-rastreamento.component';
import { AppAlunoPerfilComponent } from './app-aluno-perfil.component';
import { AppAlunoNotificacoesComponent } from './app-aluno-notificacoes.component';

type Screen = 'dashboard' | 'reserva' | 'qrcode' | 'rastreamento' | 'perfil' | 'notificacoes';

interface NavItem {
  id: Screen;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [
    CommonModule,
    AppAlunoDashboardComponent,
    AppAlunoReservaComponent,
    AppAlunoQrcodeComponent,
    AppAlunoRastreamentoComponent,
    AppAlunoPerfilComponent,
    AppAlunoNotificacoesComponent
  ],
  templateUrl: './app-aluno.component.html',
  styleUrl: './app-aluno.component.css'
})
export class AppAlunoComponent {
  private authService = inject(AuthService);
  currentScreen: Screen = 'dashboard';

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: 'home', description: 'Visão geral' },
    { id: 'reserva', label: 'Reservas', icon: 'calendar', description: 'Gerenciar viagens' },
    { id: 'qrcode', label: 'QR Code', icon: 'qr', description: 'Embarque' },
    { id: 'rastreamento', label: 'Rastrear', icon: 'map', description: 'Localização' },
    { id: 'notificacoes', label: 'Notificações', icon: 'bell', description: 'Alertas' },
    { id: 'perfil', label: 'Perfil', icon: 'user', description: 'Configurações' }
  ];

  user = this.authService.user;

  userName = computed(() => {
    const user = this.user();
    if (!user?.nome) return 'Usuário';
    return user.nome.split(' ')[0];
  });

  constructor() {
    // Listen for custom navigation events from child components
    window.addEventListener('navigate-to-reservas', () => this.setScreen('reserva'));
    window.addEventListener('navigate-to-notificacoes', () => this.setScreen('notificacoes'));
  }

  setScreen(screen: Screen): void {
    this.currentScreen = screen;
  }

  logout(): void {
    this.authService.logout();
  }

  getIconSvg(icon: string): string {
    const icons: Record<string, string> = {
      home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
      calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
      map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"></polygon><line x1="12" y1="12" x2="12" y2="12"></line></svg>`,
      bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
      user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
      logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
    };
    return icons[icon] || '';
  }

  getCurrentScreenTitle(): string {
    const item = this.navItems.find(i => i.id === this.currentScreen);
    return item?.label || '';
  }

  getCurrentScreenDescription(): string {
    const item = this.navItems.find(i => i.id === this.currentScreen);
    return item?.description || '';
  }
}