import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-perfil.component.html',
  styleUrl: './app-aluno-perfil.component.css'
})
export class AppAlunoPerfilComponent {
  private authService = inject(AuthService);
  user = this.authService.user;
}