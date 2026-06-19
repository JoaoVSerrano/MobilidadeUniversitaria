import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { MotoristaService } from '../services/motorista.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-motorista-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-motorista-dashboard.component.html',
  styleUrl: './app-motorista-dashboard.component.css'
})
export class AppMotoristaDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private motoristaService = inject(MotoristaService);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  motorista = signal<any>(null);
  viagens = signal<any[]>([]);
  isLoading = signal(true);
  erro = signal('');

  proximaViagem = computed(() =>
    this.viagens().find(v => v.status === 'AGENDADA' || v.status === 'EM_ANDAMENTO') ?? null
  );

  estatisticas = computed(() => ({
    total:      this.viagens().length,
    finalizadas: this.viagens().filter(v => v.status === 'FINALIZADA').length,
    canceladas:  this.viagens().filter(v => v.status === 'CANCELADA').length,
    agendadas:   this.viagens().filter(v => v.status === 'AGENDADA').length
  }));

  ngOnInit() {
    const user = this.auth.user();
    if (!user) { this.isLoading.set(false); return; }

    // Carregar dados do motorista
    this.motoristaService.getMotoristaById(user.id).subscribe({
      next: (m) => this.motorista.set(m),
      error: () => this.motorista.set(user)
    });

    // Carregar viagens de hoje
    this.http.get<any[]>(`${this.baseUrl}/driver/trips/today`).subscribe({
      next: (data) => { this.viagens.set(data); this.isLoading.set(false); },
      error: () => {
        // Fallback: carregar todas as viagens do motorista
        this.motoristaService.getViagensByMotoristaId(user.id).subscribe({
          next: (data) => { this.viagens.set(data); this.isLoading.set(false); },
          error: () => { this.isLoading.set(false); }
        });
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      AGENDADA: 'badge-info',
      EM_ANDAMENTO: 'badge-warning',
      FINALIZADA: 'badge-success',
      CANCELADA: 'badge-danger'
    };
    return map[status] ?? 'badge-info';
  }

  formatHora(dt: string): string {
    if (!dt) return '--:--';
    return new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
