import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../models/dashboard.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private svc = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
  private hasLoadedOnce = false;

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
    console.log('UsersComponent ngOnInit called');
    this.loadUsers();

    // Listen to route changes to reload data when tab is opened
    this.router.events.subscribe((event) => {
      if (event.constructor.name === 'NavigationEnd') {
        // Check if the current route is the users route
        if (this.router.url === '/dashboard/usuarios') {
          console.log('Users route activated, reloading data');
          this.loadUsers();
        }
      }
    });
  }

  loadUsers() {
    console.log('Loading users...');
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.svc.getUsers().subscribe({
      next: (data) => {
        console.log('Users loaded successfully:', data);
        this.users = data;
        this.filtered = data;
        this.totalUsers = data.length;
        this.totalAlunos = data.filter(u => u.type === 'aluno').length;
        this.totalMotoristas = data.filter(u => u.type === 'motorista').length;
        this.totalPendentes = data.filter(u => u.status === 'Pendente').length;
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage.set('Erro ao carregar usuários: ' + (err.message || 'Erro desconhecido'));
        this.isLoading.set(false);
        this.cdr.detectChanges();
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
    console.log('createUser called with formData:', this.formData);
    
    if (!this.formData.name || !this.formData.email || !this.formData.cpf) {
      console.log('Validation failed: missing required fields');
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.svc.createUser({
      name: this.formData.name,
      email: this.formData.email,
      cpf: this.formData.cpf,
      phone: this.formData.phone,
      type: this.formData.type as any
    }).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.clearStorage();
        this.closeCreateModal();
        this.loadUsers();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.errorMessage.set('Erro ao criar usuário: ' + (err.message || 'Erro desconhecido'));
        this.isLoading.set(false);
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
    console.log('updateUser called with formData:', this.formData);
    const user = this.selectedUser();
    if (!user) {
      console.log('No user selected for update');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.svc.updateUser(user.id, {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone
    }).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        this.closeEditModal();
        this.loadUsers();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.errorMessage.set('Erro ao atualizar usuário: ' + (err.message || 'Erro desconhecido'));
        this.isLoading.set(false);
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
    console.log('confirmDelete called');
    const user = this.selectedUser();
    if (!user) {
      console.log('No user selected for delete');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.svc.deleteUser(user.id).subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        this.closeDeleteModal();
        this.loadUsers();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.errorMessage.set('Erro ao excluir usuário: ' + (err.message || 'Erro desconhecido'));
        this.isLoading.set(false);
      }
    });
  }
}