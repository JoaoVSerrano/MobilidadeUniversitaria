import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  // General settings
  nomeInstituicao: string = 'Universidade Go Campus';
  emailContato: string = 'contato@gocampus.edu.br';
  telefone: string = '(11) 3000-0000';

  // Operational settings
  reservasAut: boolean = true;
  notifEmail: boolean = false;
  rastreamentoGps: boolean = true;

  // Toast notification
  toastMessage: string | null = null;

  salvarConfiguracoes() {
    // Show toast
    this.toastMessage = 'Configurações salvas com sucesso!';
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
