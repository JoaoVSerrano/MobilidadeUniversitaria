import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { SearchService } from '../services/search.service';
import { User } from '../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  private svc = inject(DashboardService);
  private searchSvc = inject(SearchService);

  users: User[] = [];
  filtered: User[] = [];
  search: string = '';
  filterType: string = 'todos';
  filterStatus: string = 'todos';

  totalUsers = 0;
  totalAlunos = 0;
  totalMotoristas = 0;
  totalPendentes = 0;

  // Modal Control
  showCreateModal = false;
  newUser: Partial<User> = {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    type: 'aluno',
    status: 'Ativo'
  };

  private sub = new Subscription();

  ngOnInit() {
    this.sub.add(
      this.svc.getUsers().subscribe(data => {
        this.users = data;
        this.filtered = data;
        this.totalUsers = data.length;
        this.totalAlunos = data.filter(u => u.type === 'aluno').length;
        this.totalMotoristas = data.filter(u => u.type === 'motorista').length;
        this.totalPendentes = data.filter(u => u.status === 'Pendente').length;
        this.applyFilters();
      })
    );

    // Sincronizar busca global
    this.sub.add(
      this.searchSvc.searchQuery$.subscribe(query => {
        this.search = query;
        this.applyFilters();
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getInitials(name: string): string {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchSvc.setSearchQuery(val);
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

  // Modal Actions
  openCreateModal() {
    this.showCreateModal = true;
    this.newUser = {
      name: '',
      cpf: '',
      email: '',
      phone: '',
      type: 'aluno',
      status: 'Ativo'
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.cpf) {
      alert('Nome, CPF e E-mail são obrigatórios!');
      return;
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const user: User = {
      id: 0,
      name: this.newUser.name,
      cpf: this.newUser.cpf,
      email: this.newUser.email,
      phone: this.newUser.phone || '',
      type: this.newUser.type as User['type'],
      status: this.newUser.status as User['status'],
      createdAt: formattedDate
    };

    this.svc.addUser(user);
    this.closeCreateModal();
  }
}
