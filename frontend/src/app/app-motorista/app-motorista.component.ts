import { Component, signal, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppMotoristaViagensComponent } from './app-motorista-viagens.component';
import { AppMotoristaQrComponent } from './app-motorista-qr.component';
import { AppMotoristaDashboardComponent } from './app-motorista-dashboard.component';
import { AuthService } from '../services/auth.service';

type Screen = 'dashboard' | 'viagens' | 'qr' | 'controle';

@Component({
  selector: 'app-motorista',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AppMotoristaViagensComponent,
    AppMotoristaQrComponent,
    AppMotoristaDashboardComponent
  ],
  templateUrl: './app-motorista.component.html',
  styleUrl: './app-motorista.component.css'
})
export class AppMotoristaComponent {
  private authService = inject(AuthService);
  currentScreen = signal<Screen>('dashboard');
  sidebarOpen = signal(false);

  get user() {
    return this.authService.user;
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  setScreen(screen: Screen): void {
    this.currentScreen.set(screen);
    this.closeSidebar();
  }

  logout(): void {
    this.authService.logout();
  }
}
