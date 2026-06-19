import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  private baseUrl = environment.apiUrl;

  qrData = signal<any>(null);
  isLoading = signal(true);
  erro = signal('');

  ngOnInit() { this.carregar(); }

  carregar() {
    this.isLoading.set(true);
    this.erro.set('');
    this.http.get<any>(`${this.baseUrl}/student/qrcode`).subscribe({
      next: (data) => { this.qrData.set(data); this.isLoading.set(false); },
      error: (err: any) => {
        this.erro.set(err.error?.message || 'Nenhum QR Code ativo no momento.');
        this.isLoading.set(false);
      }
    });
  }

  refresh() {
    this.isLoading.set(true);
    this.http.post<any>(`${this.baseUrl}/student/qrcode/refresh`, {}).subscribe({
      next: (data) => { this.qrData.set(data); this.isLoading.set(false); },
      error: () => { this.erro.set('Erro ao atualizar QR Code.'); this.isLoading.set(false); }
    });
  }
}