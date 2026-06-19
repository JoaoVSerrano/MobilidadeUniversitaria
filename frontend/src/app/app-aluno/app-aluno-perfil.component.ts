import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AlunoService } from '../services/aluno.service';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-perfil.component.html',
  styleUrl: './app-aluno-perfil.component.css'
})
export class AppAlunoPerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private alunoService = inject(AlunoService);

  user = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    const authUser = this.authService.user();
    if (!authUser) { this.isLoading.set(false); return; }

    this.alunoService.getAlunoById(authUser.id).subscribe({
      next: (data) => { this.user.set(data); this.isLoading.set(false); },
      error: () => { this.user.set(authUser); this.isLoading.set(false); }
    });
  }
}
