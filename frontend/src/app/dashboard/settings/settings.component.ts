import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private svc = inject(DashboardService);

  nomeInstituicao = '';
  emailContato = '';
  telefone = '';
  reservasAut = true;
  notifEmail = false;
  rastreamentoGps = false;

  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');
  isLoading = signal(false);

  ngOnInit() {
    this.svc.getSystemSettings().subscribe({
      next: (s: any) => {
        this.nomeInstituicao = s.nomeInstituicao ?? '';
        this.emailContato    = s.emailContato ?? '';
        this.telefone        = s.telefone ?? '';
        this.reservasAut     = s.reservasAutomaticas ?? true;
        this.notifEmail      = s.notificacoesEmail ?? false;
        this.rastreamentoGps = s.rastreamentoGps ?? false;
      },
      error: () => this.showToast('Erro ao carregar configurações', 'error')
    });
  }

  salvarConfiguracoes() {
    this.isLoading.set(true);
    this.svc.updateSystemSettings({
      nomeInstituicao: this.nomeInstituicao,
      emailContato:    this.emailContato,
      telefone:        this.telefone,
      reservasAutomaticas: this.reservasAut,
      notificacoesEmail:   this.notifEmail,
      rastreamentoGps:     this.rastreamentoGps
    }).subscribe({
      next: () => { this.isLoading.set(false); this.showToast('Configurações salvas!', 'success'); },
      error: () => { this.isLoading.set(false); this.showToast('Erro ao salvar configurações', 'error'); }
    });
  }

  private showToast(msg: string, type: 'success' | 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }
}