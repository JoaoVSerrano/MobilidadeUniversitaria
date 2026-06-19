import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAlunoDashboardComponent } from './app-aluno-dashboard.component';
import { AppAlunoReservaComponent } from './app-aluno-reserva.component';
import { AppAlunoQrcodeComponent } from './app-aluno-qrcode.component';
import { AppAlunoRastreamentoComponent } from './app-aluno-rastreamento.component';
import { AppAlunoNotificacoesComponent } from './app-aluno-notificacoes.component';
import { AppAlunoPerfilComponent } from './app-aluno-perfil.component';
import { AuthService } from '../services/auth.service';

type Screen = 'dashboard' | 'reserva' | 'qrcode' | 'rastreamento' | 'notificacoes' | 'perfil';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [
    CommonModule,
    AppAlunoDashboardComponent,
    AppAlunoReservaComponent,
    AppAlunoQrcodeComponent,
    AppAlunoRastreamentoComponent,
    AppAlunoNotificacoesComponent,
    AppAlunoPerfilComponent
  ],
  templateUrl: './app-aluno.component.html',
  styleUrl: './app-aluno.component.css'
})
export class AppAlunoComponent {
  private authService = inject(AuthService);
  currentScreen = signal<Screen>('dashboard');

  get user() {
    return this.authService.user;
  }

  setScreen(screen: Screen): void {
    this.currentScreen.set(screen);
  }

  logout(): void {
    this.authService.logout();
  }
}
