import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface RotaDisponivel {
  id: number;
  nomeRota: string;
  pontoParada: string;
  descricao: string;
}

@Component({
  selector: 'app-aluno-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-aluno-reserva.component.html',
  styleUrl: './app-aluno-reserva.component.css'
})
export class AppAlunoReservaComponent implements OnInit {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  dataSelecionada = '';
  rotaSelecionada = '';
  rotas = signal<RotaDisponivel[]>([]);
  isLoading = signal(false);
  mensagem = signal('');
  mensagemTipo = signal<'success' | 'error' | ''>('');

  ngOnInit() {
    this.http.get<RotaDisponivel[]>(`${this.baseUrl}/rotas`).subscribe({
      next: (data) => this.rotas.set(data),
      error: () => this.rotas.set([])
    });
  }

  reservar() {
    if (!this.dataSelecionada || !this.rotaSelecionada) {
      this.mensagem.set('Selecione a data e a rota.');
      this.mensagemTipo.set('error');
      return;
    }

    this.isLoading.set(true);
    this.http.post(`${this.baseUrl}/student/trips/confirm`, {
      rotaId: Number(this.rotaSelecionada),
      data: this.dataSelecionada
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.mensagem.set('Reserva confirmada com sucesso!');
        this.mensagemTipo.set('success');
        this.dataSelecionada = '';
        this.rotaSelecionada = '';
        setTimeout(() => this.mensagem.set(''), 3000);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.mensagem.set(err.error?.message || 'Erro ao confirmar reserva.');
        this.mensagemTipo.set('error');
      }
    });
  }
}