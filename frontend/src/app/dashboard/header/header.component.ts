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

  ngOnInit() {
    // (placeholder for future view toggle logic)
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
