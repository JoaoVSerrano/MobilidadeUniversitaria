import { Component, OnInit } from '@angular/core';
import { MotoristaService } from '../services/motorista.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface Motorista {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  userType: string;
  cnhNumero: string;
  vencimentoCNH: string;
}

export interface Viagem {
  id: number;
  rota: string;
  horario: string;
  status: string;
  passageiros: number;
  ocupacao: number;
}

@Component({
  selector: 'app-motorista-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-motorista-dashboard.component.html',
  styleUrl: './app-motorista-dashboard.component.css'
})
export class AppMotoristaDashboardComponent implements OnInit {
  // User data
  user: Motorista | null = null;

  // Dashboard data
  proximaViagem = {
    rota: 'Centro-Campus',
    horario: '06:30',
    passageiros: 32,
    status: 'AGENDADA'
  };

  viagensHoje: Viagem[] = [
    { id: 1, rota: 'Centro-Campus', horario: '06:30', status: 'AGENDADA', passageiros: 32, ocupacao: 71 },
    { id: 2, rota: 'Bairro-Campus', horario: '08:15', status: 'EM_ANDAMENTO', passageiros: 28, ocupacao: 70 },
    { id: 3, rota: 'Centro-Campus', horario: '12:00', status: 'FINALIZADA', passageiros: 45, ocupacao: 100 }
  ];

  estatisticas = {
    totalViagens: 150,
    finalizadas: 140,
    canceladas: 5,
    atrasadas: 3
  };

  // Loading states
  isLoading = false;
  errorMessage = '';

  constructor(
    private motoristaService: MotoristaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const user = this.authService.user();
    if (user) {
      this.isLoading = true;
      this.errorMessage = '';

      // Get motorista data from backend
      this.motoristaService.getMotoristaById(user.id).subscribe({
        next: (motoristaData: Motorista) => {
          this.user = motoristaData;
          this.isLoading = false;

          // Load additional data
          this.loadViagensHoje();
          this.loadEstatisticas();
        },
        error: (error: any) => {
          this.errorMessage = 'Erro ao carregar dados do usuário';
          this.isLoading = false;
          console.error('Error loading user data:', error);
        }
      });
    }
  }

  private loadViagensHoje(): void {
    const user = this.authService.user();
    if (user) {
      this.motoristaService.getViagensByMotoristaId(user.id).subscribe({
        next: (viagens) => {
          // Update viagensHoje with real data
          this.viagensHoje = viagens.map((v: any) => ({
            id: v.id,
            rota: v.rota,
            horario: v.horario,
            status: v.status,
            passageiros: v.passageiros,
            ocupacao: v.ocupacao ?? 0
          }));

          // Update proximaViagem with the next upcoming trip
          const proxima = viagens.find(v => v.status === 'AGENDADA' || v.status === 'EM_ANDAMENTO');
          if (proxima) {
            this.proximaViagem = {
              rota: proxima.rota,
              horario: proxima.horario,
              passageiros: proxima.passageiros,
              status: proxima.status
            };
          }
        },
        error: (error) => {
          console.error('Error loading viagens:', error);
          // Keep mock data if there's an error
        }
      });
    }
  }

  private loadEstatisticas(): void {
    const user = this.authService.user();
    if (user) {
      // In a real app, we would call a service to get statistics
      // For now, we'll keep the mock data or we could make another API call
      // Let's assume we have an endpoint for statistics
      // Since we don't have one, we'll leave it as mock for now.
      // Alternatively, we could calculate from viagensHoje and other data.
    }
  }

  private calculateEstatisticas(viagens: Viagem[]): void {
    this.estatisticas.totalViagens = viagens.length;
    this.estatisticas.finalizadas = viagens.filter(v => v.status === 'FINALIZADA').length;
    this.estatisticas.canceladas = viagens.filter(v => v.status === 'CANCELADA').length;
    this.estatisticas.atrasadas = viagens.filter(v => v.status === 'ATRASADA').length; // Assuming we have this status
  }

  logout(): void {
    this.authService.logout();
  }
}