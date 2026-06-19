import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppMotoristaViagensComponent } from './app-motorista-viagens.component';
import { AppMotoristaQrComponent } from './app-motorista-qr.component';

type Screen = 'viagens' | 'qr' | 'controle';

interface NavItem {
  id: Screen;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-motorista',
  standalone: true,
  imports: [
    CommonModule,
    AppMotoristaViagensComponent,
    AppMotoristaQrComponent
  ],
  templateUrl: './app-motorista.component.html',
  styleUrl: './app-motorista.component.css'
})
export class AppMotoristaComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentScreen: Screen = 'viagens';

  navItems: NavItem[] = [
    { id: 'viagens', label: 'Viagens', icon: 'route' },
    { id: 'qr', label: 'Scanner', icon: 'qr' },
    { id: 'controle', label: 'Status', icon: 'pulse' }
  ];

  user = this.authService.user;

  setScreen(screen: Screen): void {
    this.currentScreen = screen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getIconSvg(icon: string): string {
    const icons: Record<string, string> = {
      route: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
      qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
      pulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
      logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
    };
    return icons[icon] || '';
  }
}