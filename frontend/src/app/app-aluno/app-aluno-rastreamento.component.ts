import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripTrackingService, TripLocation } from '../services/trip-tracking.service';
import { AlunoService } from '../services/aluno.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aluno-rastreamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-rastreamento.component.html',
  styleUrl: './app-aluno-rastreamento.component.css'
})
export class AppAlunoRastreamentoComponent implements OnInit, OnDestroy {
  private trackingService = inject(TripTrackingService);
  private alunoService = inject(AlunoService);
  private authService = inject(AuthService);
  private sub?: Subscription;

  location = signal<TripLocation | null>(null);
  isConnected = signal(false);
  tripId = signal<number | null>(null);

  rota = [
    { nome: 'Terminal Central', hora: '07:00', chegou: true },
    { nome: 'Praça da Sé', hora: '07:10', chegou: true },
    { nome: 'Avenida Paulista', hora: '07:20', chegou: false },
    { nome: 'Universidade', hora: '07:30', chegou: false }
  ];

  ngOnInit() {
    const user = this.authService.user();
    if (!user) return;

    this.alunoService.getViagensByAlunoId(user.id).subscribe({
      next: (viagens: any[]) => {
        const ativa = viagens.find((v: any) =>
          v.status === 'EM_ANDAMENTO' || v.status === 'AGENDADA'
        );
        if (ativa) {
          this.tripId.set(ativa.id);
          this.sub = this.trackingService.subscribeToTrip(ativa.id).subscribe(loc => {
            if (loc) {
              this.location.set(loc);
              this.isConnected.set(true);
            }
          });
        }
      },
      error: () => {}
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.trackingService.deactivate();
  }
}