import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formData = {
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      bairro: '',
      numero: '',
      complemento: '',
      tipoLocal: 'RESIDENCIAL' as 'RESIDENCIAL' | 'FACULDADE'
    }
  };

  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {}

  formatCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    event.target.value = value;
    this.formData.cpf = value.replace(/\D/g, '');
  }

  formatTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    event.target.value = value;
    this.formData.telefone = value;
  }

  formatCEP(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    event.target.value = value;
    this.formData.endereco.cep = value;
  }

  register(event: Event) {
    event.preventDefault();
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validation
    if (!this.formData.nome || !this.formData.email || !this.formData.cpf ||
        !this.formData.senha || !this.formData.telefone) {
      this.errorMessage.set('Preencha todos os campos obrigatórios');
      return;
    }

    if (this.formData.cpf.replace(/\D/g, '').length !== 11) {
      this.errorMessage.set('CPF deve ter 11 dígitos');
      return;
    }

    if (this.formData.senha.length < 6) {
      this.errorMessage.set('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$|^\(\d{2}\) \d{4}-\d{4}$/;
    if (!telefoneRegex.test(this.formData.telefone)) {
      this.errorMessage.set('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
      return;
    }

    this.isLoading.set(true);

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.successMessage.set('Conta criada com sucesso! Redirecionando para login...');
        this.isLoading.set(false);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        if (err.message.includes(' primeiro gestor')) {
          this.errorMessage.set('Sistema já configurado. Redirecionando para login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.message.includes('Email ja cadastrado')) {
          this.errorMessage.set('Este email já está cadastrado');
        } else if (err.message.includes('CPF ja cadastrado')) {
          this.errorMessage.set('Este CPF já está cadastrado');
        } else {
          this.errorMessage.set(err.message);
        }
      }
    });
  }
}