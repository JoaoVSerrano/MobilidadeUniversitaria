import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../models/dashboard.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private svc = inject(DashboardService);

  users: User[] = [];
  filtered: User[] = [];
  search: string = '';
  filterType: string = 'todos';
  filterStatus: string = 'todos';

  totalUsers = 0;
  totalAlunos = 0;
  totalMotoristas = 0;
  totalPendentes = 0;

  ngOnInit() {
    this.svc.getUsers().subscribe(data => {
      this.users = data;
      this.filtered = data;
      this.totalUsers = data.length;
      this.totalAlunos = data.filter(u => u.type === 'aluno').length;
      this.totalMotoristas = data.filter(u => u.type === 'motorista').length;
      this.totalPendentes = data.filter(u => u.status === 'Pendente').length;
    });
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onTypeChange(event: Event) {
    this.filterType = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onStatusChange(event: Event) {
    this.filterStatus = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters() {
    this.filtered = this.users.filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase()) ||
        u.cpf.includes(this.search);
      const matchType = this.filterType === 'todos' || u.type === this.filterType;
      const matchStatus = this.filterStatus === 'todos' || u.status === this.filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }
}
