import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../models/dashboard.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Modal states
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showViewModal = signal(false);
  selectedUser = signal<User | null>(null);

  private readonly STORAGE_KEY = 'dashboard_users_form';

  // Form data
  formData: { name: string; email: string; cpf: string; phone: string; type: string } = {
    name: '',
    email: '',
    cpf: '',
    phone: '',
    type: 'aluno'
  };

  isLoading = signal(false);
  errorMessage = signal('');

  private saveFormToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.formData));
  }

  private loadFormFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.formData = { ...this.formData, ...parsed };
      } catch { /* ignore */ }
    }
  }

  private clearStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.svc.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filtered = data;
        this.totalUsers = data.length;
        this.totalAlunos = data.filter(u => u.type === 'aluno').length;
        this.totalMotoristas = data.filter(u => u.type === 'motorista').length;
        this.totalPendentes = data.filter(u => u.status === 'Pendente').length;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erro ao carregar usuários');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  }

  // View user
  openViewModal(user: User) {
    this.selectedUser.set(user);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedUser.set(null);
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

  // Create user
  openCreateModal() {
    this.loadFormFromStorage();
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onFormChange() {
    this.saveFormToStorage();
  }

  createUser() {
    if (!this.formData.name || !this.formData.email || !this.formData.cpf) {
      return;
    }

    this.svc.createUser({
      name: this.formData.name,
      email: this.formData.email,
      cpf: this.formData.cpf,
      phone: this.formData.phone,
      type: this.formData.type as any
    }).subscribe({
      next: () => {
        this.clearStorage();
        this.closeCreateModal();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao criar usuário:', err);
      }
    });
  }

  // Edit user
  openEditModal(user: User) {
    this.selectedUser.set(user);
    this.formData = {
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      type: user.type
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
  }

  updateUser() {
    const user = this.selectedUser();
    if (!user) return;

    this.svc.updateUser(user.id, {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone
    }).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao atualizar usuário:', err);
      }
    });
  }

  // Delete user
  openDeleteModal(user: User) {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (!user) return;

    this.svc.deleteUser(user.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
      }
    });
  }
}