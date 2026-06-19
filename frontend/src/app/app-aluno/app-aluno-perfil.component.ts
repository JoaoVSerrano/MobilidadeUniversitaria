import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-perfil/app-aluno-perfil.component.html',
  styleUrl: './app-aluno-perfil/app-aluno-perfil.component.css'
})
export class AppAlunoPerfilComponent {
  user = {
    nome: 'Aluno Teste',
    email: 'aluno@gocampus.com',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-0003',
    dataNascimento: '01/01/2000'
  };
}