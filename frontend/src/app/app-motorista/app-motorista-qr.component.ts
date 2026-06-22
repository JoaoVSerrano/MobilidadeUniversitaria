import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { QrCodeService } from '../services/qrcode.service';

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
  private qrCodeService = inject(QrCodeService);

  qrInput = '';
  qrCodeImage = signal<string>('');
  expiresAt = signal<string>('');
  resultado = signal<any>(null);
  isLoading = signal(false);
  erro = signal('');
  sucesso = signal('');

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
          this.sucesso.set(`Embarque confirmado - ${res.alunoNome || 'Aluno'}`);
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
        this.isLoading.set(false);
        this.erro.set(err.error?.message || 'QR Code inválido ou expirado.');
      }
    });
  }

  limpar() {
    this.qrInput = '';
    this.resultado.set(null);
    this.erro.set('');
    this.sucesso.set('');
  }

  async gerarQRCode(tripId: number) {
    this.isLoading.set(true);
    this.erro.set('');

    this.http.get<{qrData: string, expiresAt: string}>(`${this.baseUrl}/driver/trips/${tripId}/qrcode`).subscribe({
      next: async (res) => {
        try {
          const imageData = await this.qrCodeService.generateQrCode(res.qrData);
          this.qrCodeImage.set(imageData);
          this.expiresAt.set(res.expiresAt);
        } catch {
          this.erro.set('Erro ao gerar imagem do QR Code');
        } finally {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.erro.set(err.error?.message || 'Erro ao obter dados do QR Code');
        this.isLoading.set(false);
      }
    });
  }

  simularScan() {
    const codigoSimulado = 'GOCAMPUS-' + Math.floor(Math.random() * 1000);
    this.qrInput = codigoSimulado;
    this.validarQR();
  }
}
