import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motorista-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-motorista-perfil/app-motorista-perfil.component.html',
  styleUrl: './app-motorista-perfil/app-motorista-perfil.component.css'
})
export class AppMotoristaPerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    const authUser = this.authService.user();

    if (authUser) {
      this.user.set(authUser);
    }
    this.isLoading.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}