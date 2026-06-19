import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { email: '', senha: '' };
  errorMessage = signal<string>('');
  isLoading = computed(() => this.authService.isLoading());
  showPassword = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      const user = this.authService.user();
      if (user) {
        this.router.navigate([this.authService.getRedirectPath(user.tipoUsuario)]);
      }
    }
  }

  login(event?: Event) {
    event?.preventDefault();
    this.errorMessage.set('');

    if (!this.credentials.email || !this.credentials.senha) {
      this.errorMessage.set('Preencha todos os campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.credentials.email)) {
      this.errorMessage.set('Informe um email válido');
      return;
    }

    this.authService.login({
      email: this.credentials.email.trim(),
      senha: this.credentials.senha
    }).subscribe({
      next: (response) => {
        const redirectPath = this.authService.getRedirectPath(response.tipoUsuario);
        this.router.navigate([redirectPath]);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
      }
    });
  }

  fillTestUser(role: 'gestor' | 'aluno' | 'motorista') {
    const testUsers = {
      gestor: { email: 'admin@gocampus.com', senha: 'password' },
      aluno: { email: 'aluno@gocampus.com', senha: 'password' },
      motorista: { email: 'motorista@gocampus.com', senha: 'password' }
    };
    this.credentials = testUsers[role];
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }
}