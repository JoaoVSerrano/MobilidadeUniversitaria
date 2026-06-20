import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlunoService } from '../services/aluno.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-aluno-perfil.component.html',
  styleUrl: './app-aluno-perfil.component.css'
})
export class AppAlunoPerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private alunoService = inject(AlunoService);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  user = signal<any>(null);
  isLoading = signal(true);
  formData = signal({
    nome: '',
    email: '',
    telefone: '',
    matricula: ''
  });
  mensagem = signal('');
  mensagemTipo = signal<'success' | 'error' | ''>('');

  ngOnInit() {
    const authUser = this.authService.user();
    if (!authUser) { this.isLoading.set(false); return; }

    this.alunoService.getAlunoById(authUser.id).subscribe({
      next: (data) => {
        this.user.set(data);
        this.formData.set({
          nome: data.nome || authUser.nome || '',
          email: data.email || authUser.email || '',
          telefone: (data as any).telefone || (authUser as any).telefone || '',
          matricula: (data as any).matricula || String(authUser.id) || '000000'
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.user.set(authUser);
        this.formData.set({
          nome: authUser.nome || '',
          email: authUser.email || '',
          telefone: (authUser as any).telefone || '',
          matricula: String(authUser.id) || '000000'
        });
        this.isLoading.set(false);
      }
    });
  }

  getIniciais(): string {
    const user = this.user();
    if (!user?.nome) return 'AL';
    const nomes = user.nome.split(' ');
    if (nomes.length >= 2) {
      return (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
    }
    return user.nome.substring(0, 2).toUpperCase();
  }

  updateFormData(field: string, value: string) {
    this.formData.update(data => ({ ...data, [field]: value }));
  }

  salvarAlteracoes() {
    const data = this.formData();
    if (!data.nome || !data.email) {
      this.mensagem.set('Nome e email são obrigatórios.');
      this.mensagemTipo.set('error');
      return;
    }

    this.isLoading.set(true);
    this.mensagem.set('');
    this.mensagemTipo.set('');

    // TODO: substituir por endpoint backend real
    this.http.put(`${this.baseUrl}/usuarios/${this.user()?.id}`, {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.mensagem.set('Alterações salvas com sucesso!');
        this.mensagemTipo.set('success');
        // Update local user data
        this.user.update(u => ({ ...u, nome: data.nome, email: data.email, telefone: data.telefone }));
        setTimeout(() => this.mensagem.set(''), 3000);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.mensagem.set(err.error?.message || 'Erro ao salvar alterações.');
        this.mensagemTipo.set('error');
      }
    });
  }
}
