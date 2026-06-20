import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../models/dashboard.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface StudentRequest {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  status: string;
  createdAt: string;
}

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
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  users: User[] = [];
  filtered: User[] = [];
  search: string = '';
  filterType: string = 'todos';
  filterStatus: string = 'todos';

  totalUsers = 0;
  totalAlunos = 0;
  totalMotoristas = 0;
  totalPendentes = 0;

  // Student requests
  studentRequests = signal<StudentRequest[]>([]);
  isLoadingRequests = signal(false);

  // Modal states
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showViewModal = signal(false);
  selectedUser = signal<User | null>(null);

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

  ngOnInit() {
    console.log('UsersComponent ngOnInit called');
    this.loadUsers();
    this.loadStudentRequests();

    // Listen to route changes to reload data when tab is opened
    this.router.events.subscribe((event) => {
      if (event.constructor.name === 'NavigationEnd') {
        // Check if the current route is the users route
        if (this.router.url === '/dashboard/usuarios') {
          console.log('Users route activated, reloading data');
          this.loadUsers();
          this.loadStudentRequests();
        }
      }
    });
  }

  loadStudentRequests() {
    this.isLoadingRequests.set(true);
    // TODO: substituir por endpoint backend real para listar solicitações
    this.http.get<StudentRequest[]>(`${this.baseUrl}/auth/student-requests`).subscribe({
      next: (data) => {
        this.studentRequests.set(data);
        this.isLoadingRequests.set(false);
      },
      error: () => {
        // Mock data se o endpoint não existir ainda
        const mockRequests: StudentRequest[] = [
          { id: 1, nome: 'João Silva', email: 'joao@email.com', cpf: '12345678901', telefone: '(11) 98765-4321', status: 'PENDING', createdAt: '2024-01-15' },
          { id: 2, nome: 'Maria Santos', email: 'maria@email.com', cpf: '98765432109', telefone: '(11) 91234-5678', status: 'PENDING', createdAt: '2024-01-16' }
        ];
        this.studentRequests.set(mockRequests);
        this.isLoadingRequests.set(false);
      }
    });
  }

  approveStudentRequest(requestId: number) {
    this.http.post(`${this.baseUrl}/auth/student-requests/${requestId}/approve`, {}).subscribe({
      next: () => {
        this.loadStudentRequests();
        this.loadUsers();
        const req = this.studentRequests().find(r => r.id === requestId);
        alert(`Aluno ${req?.nome || ''} aprovado com sucesso!`);
      },
      error: (err) => {
        alert('Erro ao aprovar: ' + (err.error?.message || err.message));
      }
    });
  }

  rejectStudentRequest(requestId: number) {
    if (!confirm('Confirma a rejeição desta solicitação?')) return;
    this.http.post(`${this.baseUrl}/auth/student-requests/${requestId}/reject`, {}).subscribe({
      next: () => {
        this.loadStudentRequests();
      },
      error: (err) => {
        alert('Erro ao rejeitar: ' + (err.error?.message || err.message));
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
    this.formData = { name: '', email: '', cpf: '', phone: '', type: 'aluno' };
    this.errorMessage.set('');
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createUser() {
    console.log('=== createUser START ===');
    console.log('formData:', JSON.stringify(this.formData));

    if (!this.formData.name || !this.formData.email || !this.formData.cpf || !this.formData.phone) {
      console.log('Validation failed - missing fields:', {
        name: !!this.formData.name,
        email: !!this.formData.email,
        cpf: !!this.formData.cpf,
        phone: !!this.formData.phone
      });
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    console.log('Validation passed, calling API...');
    this.isLoading.set(true);
    this.errorMessage.set('');

    const payload = {
      name: this.formData.name,
      email: this.formData.email,
      cpf: this.formData.cpf,
      phone: this.formData.phone,
      type: this.formData.type as any
    };
    console.log('API payload:', JSON.stringify(payload));

    this.svc.createUser(payload).subscribe({
      next: (response) => {
        console.log('=== createUser SUCCESS ===');
        console.log('Response:', response);
        this.closeCreateModal();
        this.loadUsers();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('=== createUser ERROR ===');
        console.error('Error details:', err);
        this.errorMessage.set(err.error?.message || err.message || 'Erro ao criar usuário');
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