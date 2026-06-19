import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-motorista-viagens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-motorista-viagens/app-motorista-viagens.component.html',
  styleUrl: './app-motorista-viagens/app-motorista-viagens.component.css'
})
export class AppMotoristaViagensComponent {
  // In a real app, we would get the viagens from the motorista service
  viagens = [
    { id: 1, rota: 'Centro-Campus', horario: '06:30', status: 'AGENDADA', passageiros: 32, ocupacao: 71 },
    { id: 2, rota: 'Bairro-Campus', horario: '08:15', status: 'EM_ANDAMENTO', passageiros: 28, ocupacao: 70 },
    { id: 3, rota: 'Centro-Campus', horario: '12:00', status: 'FINALIZADA', passageiros: 45, ocupacao: 100 },
    { id: 4, rota: 'Bairro-Campus', horario: '15:30', status: 'CANCELADA', passageiros: 0, ocupacao: 0 }
  ];
}