import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aluno-rastreamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-aluno-rastreamento.component.html',
  styleUrl: './app-aluno-rastreamento.component.css'
})
export class AppAlunoRastreamentoComponent {
  onibus = {
    linha: 'Centro-Campus',
    latitude: -23.5505,
    longitude: -46.6333,
    velocidade: 45,
    ultimoUpdate: 'Há 2 minutos',
    proximaParada: 'Terminal Central',
    distanciaProxima: '300m'
  };

  rota = [
    { nome: 'Terminal Central', hora: '07:00', chegou: true },
    { nome: 'Praça da Sé', hora: '07:10', chegou: true },
    { nome: 'Avenida Paulista', hora: '07:20', chegou: false },
    { nome: 'Universidade', hora: '07:30', chegou: false }
  ];
}