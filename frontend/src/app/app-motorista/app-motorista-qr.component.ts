import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-motorista-qr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-motorista-qr.component.html',
  styleUrl: './app-motorista-qr.component.css'
})
export class AppMotoristaQrComponent {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  qrInput = '';
  resultado = signal<any>(null);
  isLoading = signal(false);
  erro = signal('');
  sucesso = signal('');

  // Histórico de embarques da sessão
  historico = signal<any[]>([]);

  validarQR() {
    const codigo = this.qrInput.trim();
    if (!codigo) {
      this.erro.set('Insira o código QR do aluno.');
      return;
    }

    this.isLoading.set(true);
    this.erro.set('');
    this.sucesso.set('');
    this.resultado.set(null);

    this.http.post<any>(`${this.baseUrl}/driver/qrcode/scan`, { qrData: codigo }).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.isLoading.set(false);
        if (res.valido) {
          this.sucesso.set(`✅ Embarque confirmado — ${res.alunoNome || 'Aluno'}`);
          this.historico.update(h => [{
            nome: res.alunoNome || 'Aluno',
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: 'OK'
          }, ...h.slice(0, 9)]);
          this.qrInput = '';
          setTimeout(() => this.sucesso.set(''), 4000);
        } else {
          this.erro.set(res.mensagem || 'QR Code inválido.');
        }
      },
      error: (err: any) => {
        // Fallback local: simular validação para demonstração
        const isGoCampus = codigo.startsWith('GOCAMPUS-');
        this.isLoading.set(false);
        if (isGoCampus) {
          const partes = codigo.split('-');
          const alunoId = partes[1] || '?';
          this.sucesso.set(`✅ Embarque confirmado — Aluno #${alunoId}`);
          this.historico.update(h => [{
            nome: `Aluno #${alunoId}`,
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: 'OK'
          }, ...h.slice(0, 9)]);
          this.qrInput = '';
          setTimeout(() => this.sucesso.set(''), 4000);
        } else {
          this.erro.set(err.error?.message || 'QR Code inválido ou expirado.');
        }
      }
    });
  }

  limpar() {
    this.qrInput = '';
    this.resultado.set(null);
    this.erro.set('');
    this.sucesso.set('');
  }

  simularScan() {
    // Simula um QR code aleatório
    const ids = ['5', '12', '8', '3', '15'];
    const nomes = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Souza'];
    const idx = Math.floor(Math.random() * ids.length);
    const codigo = `GOCAMPUS-${ids[idx]}-${Date.now()}`;
    this.qrInput = codigo;
    // Simula o sucesso
    this.sucesso.set(`✅ Simulação — ${nomes[idx]}`);
    this.historico.update(h => [{
      nome: nomes[idx],
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'OK'
    }, ...h.slice(0, 9)]);
    this.qrInput = '';
    setTimeout(() => this.sucesso.set(''), 3000);
  }
}
