import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { SearchService } from '../services/search.service';
import { ActiveUserService, UserAccount } from '../services/active-user.service';
import { NavigationService } from '../services/navigation.service';
import { Route, Vehicle, User } from '../models/dashboard.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() currentView: 'gestor' | 'aluno' | 'motorista' = 'gestor';
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() viewChange = new EventEmitter<'gestor' | 'aluno' | 'motorista'>();

  private router = inject(Router);
  private dashboardSvc = inject(DashboardService);
  private searchSvc = inject(SearchService);
  private activeUserSvc = inject(ActiveUserService);
  private navSvc = inject(NavigationService);

  currentUser!: UserAccount;
  accounts: UserAccount[] = [];
  searchQuery = '';

  showUserDropdown = false;
  showSearchDropdown = false;

  // Data for global search
  private globalResults = {
    routes: [] as Route[],
    vehicles: [] as Vehicle[],
    users: [] as User[]
  };

  filteredResults = {
    routes: [] as Route[],
    vehicles: [] as Vehicle[],
    users: [] as User[]
  };

  private subs = new Subscription();

  ngOnInit() {
    this.accounts = this.activeUserSvc.getAccounts();
    
    // Subscribe to current user
    this.subs.add(
      this.activeUserSvc.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    // Subscribe to search query changes to sync header input
    this.subs.add(
      this.searchSvc.searchQuery$.subscribe(query => {
        this.searchQuery = query;
      })
    );

    // Fetch initial datasets for global search
    this.dashboardSvc.getRoutes().subscribe(routes => this.globalResults.routes = routes);
    this.dashboardSvc.getVehicles().subscribe(vehicles => this.globalResults.vehicles = vehicles);
    this.dashboardSvc.getUsers().subscribe(users => this.globalResults.users = users);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  selectView(view: 'gestor' | 'aluno' | 'motorista') {
    // Sync active user type with view selection
    const matchedAccount = this.accounts.find(acc => acc.type === view);
    if (matchedAccount) {
      this.activeUserSvc.setCurrentUser(matchedAccount);
    } else {
      this.viewChange.emit(view);
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  changeAccount(account: UserAccount) {
    this.activeUserSvc.setCurrentUser(account);
    this.showUserDropdown = false;
  }

  onSearchInput(value: string) {
    this.searchQuery = value;
    this.searchSvc.setSearchQuery(value);

    if (!value.trim()) {
      this.showSearchDropdown = false;
      this.filteredResults = { routes: [], vehicles: [], users: [] };
      return;
    }

    const query = value.toLowerCase();
    this.filteredResults = {
      routes: this.globalResults.routes.filter(r => 
        r.name.toLowerCase().includes(query) || r.originDest.toLowerCase().includes(query)
      ),
      vehicles: this.globalResults.vehicles.filter(v => 
        v.code.toLowerCase().includes(query) || v.model.toLowerCase().includes(query) || v.plate.toLowerCase().includes(query)
      ),
      users: this.globalResults.users.filter(u => 
        u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query) || u.type.toLowerCase().includes(query)
      )
    };

    this.showSearchDropdown = 
      this.filteredResults.routes.length > 0 || 
      this.filteredResults.vehicles.length > 0 || 
      this.filteredResults.users.length > 0;
  }

  onResultClick(item: any, type: 'rota' | 'veiculo' | 'usuario') {
    this.showSearchDropdown = false;
    
    // Ensure we are in gestor view to view dashboards / lists
    if (this.currentView !== 'gestor') {
      const gestorAcc = this.accounts.find(acc => acc.type === 'gestor');
      if (gestorAcc) {
        this.activeUserSvc.setCurrentUser(gestorAcc);
      }
    }

    if (type === 'rota') {
      this.searchSvc.setSearchQuery(item.name);
      this.router.navigate(['/rotas']);
    } else if (type === 'veiculo') {
      this.searchSvc.setSearchQuery(item.code);
      this.router.navigate(['/veiculos']);
    } else if (type === 'usuario') {
      this.searchSvc.setSearchQuery(item.name);
      this.router.navigate(['/usuarios']);
    }
  }

  onBellClick() {
    if (this.currentView === 'gestor') {
      this.router.navigate(['/notificacoes']);
    } else if (this.currentView === 'aluno') {
      this.navSvc.setAlunoTab('notificacoes');
    } else if (this.currentView === 'motorista') {
      // Motorista has no notifications screen, redirect to Gestor notifications
      const gestorAcc = this.accounts.find(acc => acc.type === 'gestor');
      if (gestorAcc) {
        this.activeUserSvc.setCurrentUser(gestorAcc);
      }
      this.router.navigate(['/notificacoes']);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-avatar-container')) {
      this.showUserDropdown = false;
    }
    if (!target.closest('.search-wrapper')) {
      this.showSearchDropdown = false;
    }
  }
}
