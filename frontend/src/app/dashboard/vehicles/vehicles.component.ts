import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Vehicle } from '../models/dashboard.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  private svc = inject(DashboardService);

  vehicles: Vehicle[] = [];
  filtered: Vehicle[] = [];
  search: string = '';
  filterStatus: string = 'Todos';

  totalVehicles = 0;
  activeVehicles = 0;
  maintenanceVehicles = 0;
  totalCapacity = 0;

  ngOnInit() {
    this.svc.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.filtered = data;
      this.totalVehicles = data.length;
      this.activeVehicles = data.filter(v => v.status === 'ativo').length;
      this.maintenanceVehicles = data.filter(v => v.status === 'manutencao').length;
      this.totalCapacity = data.reduce((acc, v) => acc + v.capacity, 0);
    });
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onStatusChange(event: Event) {
    this.filterStatus = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters() {
    this.filtered = this.vehicles.filter(v => {
      const matchSearch =
        v.code.toLowerCase().includes(this.search.toLowerCase()) ||
        v.plate.toLowerCase().includes(this.search.toLowerCase()) ||
        v.model.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = this.filterStatus === 'Todos' || v.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }
}
