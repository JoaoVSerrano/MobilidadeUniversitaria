import { Component, Input } from '@angular/core';
import { Trip } from '../models/dashboard.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input({ required: true }) trips: Trip[] = [];

  getStatusLabel(status: Trip['status']): string {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Trânsito';
      case 'completed': return 'Finalizada';
      case 'agendada': return 'Agendada';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  }
}
