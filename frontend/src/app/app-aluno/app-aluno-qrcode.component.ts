import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-aluno-qrcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-qrcode.component.html',
  styleUrl: './app-aluno-qrcode.component.css'
})
export class AppAlunoQrcodeComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environment.apiUrl;

  user = this.authService.user;
  qrData = signal<any>(null);
  isLoading = signal(true);
  erro = signal('');

  qrDataUrl = computed(() => {
    const data = this.qrData();
    if (!data?.qrData) return '';
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(this.generateQrSvg(data.qrData))}`;
  });

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.isLoading.set(true);
    this.erro.set('');
    // TODO: substituir por endpoint backend real
    this.http.get<any>(`${this.baseUrl}/student/qrcode`).subscribe({
      next: (data) => {
        this.qrData.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback local — gera QR com dados do usuário
        const user = this.user();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        this.qrData.set({
          qrData: `GOCAMPUS-${user?.id ?? 0}-${Date.now()}`,
          alunoId: user?.id,
          expiresAt: expiry.toISOString()
        });
        this.isLoading.set(false);
      }
    });
  }

  atualizarQRCode() {
    this.isLoading.set(true);
    // TODO: substituir por endpoint backend real
    this.http.post<any>(`${this.baseUrl}/student/qrcode/refresh`, {}).subscribe({
      next: (data) => {
        this.qrData.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        const user = this.user();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        this.qrData.set({
          qrData: `GOCAMPUS-${user?.id ?? 0}-${Date.now()}`,
          alunoId: user?.id,
          expiresAt: expiry.toISOString()
        });
        this.isLoading.set(false);
      }
    });
  }

  // Gera as iniciais do nome do aluno
  getIniciais(): string {
    const user = this.user();
    if (!user?.nome) return 'AL';
    const nomes = user.nome.split(' ');
    if (nomes.length >= 2) {
      return (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
    }
    return user.nome.substring(0, 2).toUpperCase();
  }

  getMatricula(): string {
    const user = this.user();
    return (user as any).matricula || String(user?.id) || '000000';
  }

  // Gera um SVG de QR Code visual baseado no hash do payload
  private generateQrSvg(payload: string): string {
    const size = 21;
    const cells: boolean[][] = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => {
        // Padrão finder (cantos)
        if ((r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)) return true;
        // Módulos de dados baseados no hash do payload
        let h = 0;
        for (let i = 0; i < payload.length; i++) h = (Math.imul(31, h) + payload.charCodeAt(i)) | 0;
        return ((h ^ (r * 37 + c * 13)) & 1) === 0;
      })
    );

    const cellSize = 8;
    const svgSize = size * cellSize + 16;
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (cells[r][c]) {
          rects += `<rect x="${c * cellSize + 8}" y="${r * cellSize + 8}" width="${cellSize}" height="${cellSize}" fill="#fff"/>`;
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}"><rect width="${svgSize}" height="${svgSize}" fill="#111"/>${rects}</svg>`;
  }

  getExpiresAt(): Date | null {
    const d = this.qrData();
    if (!d?.expiresAt) return null;
    return new Date(d.expiresAt);
  }
}
