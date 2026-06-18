import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-motorista-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-motorista-perfil.component.html',
  styleUrl: './app-motorista-perfil.component.css'
})
export class AppMotoristaPerfilComponent {
  // In a real app, we would get the user data from the auth service or a service
  user = {
    nome: 'Motorista Teste',
    email: 'motorista@gocampus.com',
    cpf: '123.456.789-01',
    telefone: '(11) 99999-0002',
    cnhNumero: '1234567890',
    vencimentoCNH: '31/12/2028'
  };
}