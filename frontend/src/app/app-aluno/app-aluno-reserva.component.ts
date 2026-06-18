import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Rota {
  id: string;
  nome: string;
  horario: string;
  ocupacao: number;
  disponivel: boolean;
}

@Component({
  selector: 'app-aluno-reserva',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app-aluno-reserva.component.html',
  styleUrl: './app-aluno-reserva.component.css'
})
export class AppAlunoReservaComponent {
  dataSelecionada = '';
  rotaSelecionada = '';

  rotas: Rota[] = [
    { id: 'centro', nome: 'Centro-Campus', horario: '07:30', ocupacao: 68, disponivel: true },
    { id: 'bairroA', nome: 'Bairro A-Campus', horario: '07:45', ocupacao: 85, disponivel: true },
    { id: 'bairroB', nome: 'Bairro B-Campus', horario: '08:00', ocupacao: 92, disponivel: true },
    { id: 'terminal', nome: 'Terminal-Campus', horario: '08:30', ocupacao: 95, disponivel: false }
  ];

  reservar() {
    if (!this.dataSelecionada || !this.rotaSelecionada) {
      alert('Por favor, selecione a data e a rota');
      return;
    }
    const rota = this.rotas.find(r => r.id === this.rotaSelecionada);
    if (rota && !rota.disponivel) {
      alert('Esta rota está lotada');
      return;
    }
    alert(`Reserva confirmada para ${rota?.nome} no dia ${this.dataSelecionada}`);
    // In a real app, we would call a service to make the reservation
  }
}