import { Component, OnInit } from '@angular/core';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  userType: string;
}

export interface Viagem {
  id: number;
  rota: string;
  horario: string;
  status: string;
  passageiros: number;
  ocupacao: number;
}

export interface PresencaDigital {
  id: number;
  dataHoraReserva: string;
  dataHoraValidacao: string;
  status: string;
}

@Component({
  selector: 'app-aluno-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-dashboard.component.html',
  styleUrl: './app-aluno-dashboard.component.css'
})
export class AppAlunoDashboardComponent implements OnInit {
  // User data
  user: Aluno | null = null;

  // Dashboard data
  proximaViagem = {
    destino: 'Centro-Campus',
    horario: '07:30',
    pontos: 'Terminal Central → Universidade',
    vagas: 12
  };

  historicoViagens: any[] = [
    { id: 1, data: '15/06', rota: 'Centro-Campus', status: 'Concluída' },
    { id: 2, data: '14/06', rota: 'Bairro-Campus', status: 'Concluída' },
    { id: 3, data: '13/06', rota: 'Centro-Campus', status: 'Cancelada' }
  ];

  estatisticas = {
    totalViagens: 24,
    presente: 22,
    atrasos: 2
  };

  // Loading states
  isLoading = false;
  errorMessage = '';

  constructor(
    private alunoService: AlunoService,
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

      // Get aluno data from backend
      this.alunoService.getAlunoById(user.id).subscribe({
        next: (alunoData: Aluno) => {
          this.user = alunoData;
          this.isLoading = false;

          // Load additional data
          this.loadViagens();
          this.loadPresencas();
        },
        error: (error: any) => {
          this.errorMessage = 'Erro ao carregar dados do usuário';
          this.isLoading = false;
          console.error('Error loading user data:', error);
        }
      });
    }
  }

  private loadViagens(): void {
    const user = this.authService.user();
    if (user) {
      this.alunoService.getViagensByAlunoId(user.id).subscribe({
        next: (viagens) => {
          // Update historicoViagens with real data
          this.historicoViagens = viagens.map((v: any) => ({
            id: v.id,
            data: this.formatDate(v.horario), // Simplified date formatting
            rota: v.rota,
            status: v.status
          }));

          // Update proximaViagem with the next upcoming trip
          const proxima = viagens.find(v => v.status === 'AGENDADA' || v.status === 'EM_ANDAMENTO');
          if (proxima) {
            this.proximaViagem = {
              destino: proxima.rota,
              horario: proxima.horario,
              pontos: `${proxima.rota} → Destino`, // Simplified
              vagas: Math.max(0, 45 - proxima.passageiros) // Assuming capacity of 45
            };
          }

          // Update statistics
          this.estatisticas.totalViagens = viagens.length;
          this.estatisticas.presente = viagens.filter(v => v.status === 'FINALIZADA').length;
          this.estatisticas.atrasos = viagens.filter(v => v.status === 'CANCELADA').length; // Simplified
        },
        error: (error) => {
          console.error('Error loading viagens:', error);
          // Keep mock data if there's an error
        }
      });
    }
  }

  private loadPresencas(): void {
    const user = this.authService.user();
    if (user) {
      this.alunoService.getPresencasByAlunoId(user.id).subscribe({
        next: (presencas) => {
          // Update statistics based on presencas if needed
          // This is just an example - you could refine the statistics calculation
        },
        error: (error) => {
          console.error('Error loading presencas:', error);
        }
      });
    }
  }

  private formatDate(dateString: string): string {
    // Simple date formatting - in a real app you might use DatePipe or a library
    try {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } catch {
      return dateString;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}