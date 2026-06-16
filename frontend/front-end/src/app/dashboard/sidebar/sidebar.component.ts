import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActiveUserService, UserAccount } from '../services/active-user.service';

interface SidebarItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  private activeUserSvc = inject(ActiveUserService);
  currentUser!: UserAccount;
  private sub = new Subscription();

  menuItems: SidebarItem[] = [
    { name: 'Dashboard',     icon: 'dashboard', route: '/'          },
    { name: 'Usuários',      icon: 'users',     route: '/usuarios'  },
    { name: 'Rotas',         icon: 'route',     route: '/rotas'     },
    { name: 'Veículos',      icon: 'bus',       route: '/veiculos'  },
    { name: 'Viagens',       icon: 'clock',     route: '/viagens'   },
    { name: 'Documentos',    icon: 'file',      route: '/documentos'},
    { name: 'Relatórios',    icon: 'chart',     route: '/relatorios'},
    { name: 'Notificações',  icon: 'bell',      route: '/notificacoes'},
    { name: 'Configurações', icon: 'settings',  route: '/configuracoes'}
  ];

  ngOnInit() {
    this.sub.add(
      this.activeUserSvc.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
