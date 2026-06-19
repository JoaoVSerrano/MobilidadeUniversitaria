import { Component, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  private router = inject(Router);
  authService = inject(AuthService);

  showProfileModal = signal(false);
  isDashboardActive = signal(true);

  ngOnInit() {
    // Update tab active state based on current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isDashboardActive.set(url === '/dashboard' || url.startsWith('/dashboard') && !url.includes('/usuarios') && !url.includes('/rotas') && !url.includes('/veiculos') && !url.includes('/viagens') && !url.includes('/documentos') && !url.includes('/relatorios') && !url.includes('/notificacoes') && !url.includes('/configuracoes'));
    });

    // Set initial state
    const currentUrl = this.router.url;
    this.isDashboardActive.set(currentUrl === '/dashboard' || (currentUrl.startsWith('/dashboard') && !currentUrl.includes('/usuarios') && !currentUrl.includes('/rotas') && !currentUrl.includes('/veiculos') && !currentUrl.includes('/viagens') && !currentUrl.includes('/documentos') && !currentUrl.includes('/relatorios') && !currentUrl.includes('/notificacoes') && !currentUrl.includes('/configuracoes')));
  }

  get user(): LoginResponse | null {
    return this.authService.user();
  }

  get userInitials(): string {
    const nome = this.user?.nome || '';
    const parts = nome.split(' ');
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onNotifications() {
    this.router.navigate(['/dashboard/notificacoes']);
  }

  onProfile() {
    this.showProfileModal.set(true);
  }

  closeProfileModal() {
    this.showProfileModal.set(false);
  }

  logout() {
    this.authService.logout();
  }
}
