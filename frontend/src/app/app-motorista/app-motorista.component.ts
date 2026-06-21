import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppMotoristaDashboardComponent } from './app-motorista-dashboard.component';
import { AppMotoristaViagensComponent } from './app-motorista-viagens.component';
import { AppMotoristaQrComponent } from './app-motorista-qr.component';
import { AppMotoristaPerfilComponent } from './app-motorista-perfil.component';
import { AppMotoristaNotificacoesComponent } from './app-motorista-notificacoes.component';

type Screen = 'dashboard' | 'viagens' | 'qr' | 'perfil' | 'notificacoes';

interface NavItem { id: Screen; label: string; icon: string; }

@Component({
  selector: 'app-motorista',
  standalone: true,
  imports: [
    CommonModule,
    AppMotoristaDashboardComponent,
    AppMotoristaViagensComponent,
    AppMotoristaQrComponent,
    AppMotoristaPerfilComponent,
    AppMotoristaNotificacoesComponent
  ],
  templateUrl: './app-motorista.component.html',
  styleUrl: './app-motorista.component.css'
})
export class AppMotoristaComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentScreen: Screen = 'dashboard';
  user = this.authService.user;

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Início',   icon: 'home'    },
    { id: 'viagens',  label: 'Viagens',  icon: 'route'   },
    { id: 'qr',       label: 'Scanner',  icon: 'qr'      },
    { id: 'notificacoes', label: 'Notificações', icon: 'bell' },
    { id: 'perfil',   label: 'Perfil',   icon: 'profile' }
  ];

  setScreen(s: Screen) { this.currentScreen = s; }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }

  getIconSvg(icon: string): string {
    const icons: Record<string, string> = {
      home: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>`,
      route: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>`,
      qr: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2h2v-2h-2v-2h-2v2zm0 4v2h-2v-2h2zm4 4v2h-2v-2h2z"/>
      </svg>`,
      bell: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>`,
      profile: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>`,
      logout: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
      </svg>`
    };
    return icons[icon] || '';
  }
}