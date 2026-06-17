import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', senha: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login(event?: Event) {
    event?.preventDefault();

    this.authService.login({
      email: this.credentials.email.trim(),
      senha: this.credentials.senha
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: any) => console.error('Login failed', err)
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
}
