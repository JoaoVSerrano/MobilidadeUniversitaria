import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MotoristaService } from '../services/motorista.service';

@Component({
  selector: 'app-motorista-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-motorista-perfil/app-motorista-perfil.component.html',
  styleUrl: './app-motorista-perfil/app-motorista-perfil.component.css'
})
export class AppMotoristaPerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private motoristaService = inject(MotoristaService);

  user: any = null;
  isLoading = true;

  ngOnInit() {
    const authUser = this.authService.user();
    if (!authUser) return;

    this.motoristaService.getMotoristaById(authUser.id).subscribe({
      next: (data) => { this.user = data; this.isLoading = false; },
      error: () => {
        this.user = authUser;
        this.isLoading = false;
      }
    });
  }
}