import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Passenger {
  id: number;
  name: string;
  mat: string;
  confirmed: boolean;
  confirmedTime?: string;
}

interface ValidationLog {
  passengerName: string;
  mat: string;
  time: string;
}

@Component({
  selector: 'app-motorista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-motorista.component.html',
  styleUrl: './app-motorista.component.css'
})
export class AppMotoristaComponent {
  currentTab: 'viagem' | 'scanner' | 'status' = 'viagem';

  // Trip details
  route: string = 'Centro-Campus';
  time: string = '07:30';
  vehicle: string = 'BUS-001';

  // Passenger list matching mockups
  passengers: Passenger[] = [
    { id: 1, name: 'João Silva', mat: '2024001234', confirmed: false },
    { id: 2, name: 'Maria Santos', mat: '2024001235', confirmed: false },
    { id: 3, name: 'Pedro Costa', mat: '2024001236', confirmed: false },
    { id: 4, name: 'Ana Oliveira', mat: '2024001237', confirmed: false },
    { id: 5, name: 'Carlos Souza', mat: '2024001238', confirmed: false },
    { id: 6, name: 'Julia Lima', mat: '2024001239', confirmed: false }
  ];

  // Scan simulation lists
  recentValidations: ValidationLog[] = [];
  toastMessage: string | null = null;
  scanning: boolean = false;

  // Trip control status
  tripStatus: 'Aguardando início' | 'Em andamento' | 'Finalizada' = 'Aguardando início';

  // Computed values
  get confirmedCount(): number {
    return this.passengers.filter(p => p.confirmed).length;
  }

  get totalCount(): number {
    return this.passengers.length;
  }

  // Navigation
  selectTab(tab: 'viagem' | 'scanner' | 'status') {
    this.currentTab = tab;
  }

  // Confirm Passenger Manually
  confirmPassenger(passenger: Passenger) {
    if (passenger.confirmed) {
      passenger.confirmed = false;
      passenger.confirmedTime = undefined;
      this.recentValidations = this.recentValidations.filter(v => v.mat !== passenger.mat);
      this.showToast(`${passenger.name} desmarcado.`);
    } else {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      passenger.confirmed = true;
      passenger.confirmedTime = timeStr;
      
      this.recentValidations.unshift({
        passengerName: passenger.name,
        mat: passenger.mat,
        time: timeStr
      });
      this.showToast(`${passenger.name} embarcado com sucesso!`);
    }
  }

  // QR Code scan simulation
  simulateScan() {
    const unconfirmed = this.passengers.filter(p => !p.confirmed);
    
    if (unconfirmed.length === 0) {
      this.showToast('Todos os alunos já embarcaram!');
      return;
    }

    this.scanning = true;
    
    // Choose random student to scan
    const randomIndex = Math.floor(Math.random() * unconfirmed.length);
    const chosenPassenger = unconfirmed[randomIndex];

    setTimeout(() => {
      this.scanning = false;
      this.confirmPassenger(chosenPassenger);
    }, 600);
  }

  // Travel state cycles
  toggleTripStatus() {
    if (this.tripStatus === 'Aguardando início') {
      this.tripStatus = 'Em andamento';
      this.showToast('Viagem iniciada! Tenha uma boa rota.');
    } else if (this.tripStatus === 'Em andamento') {
      this.tripStatus = 'Finalizada';
      this.showToast('Viagem concluída com sucesso.');
    } else {
      // Reset flow for demonstration
      this.tripStatus = 'Aguardando início';
      this.passengers.forEach(p => {
        p.confirmed = false;
        p.confirmedTime = undefined;
      });
      this.recentValidations = [];
      this.showToast('Fluxo de viagem resetado.');
    }
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 2500);
  }
}
