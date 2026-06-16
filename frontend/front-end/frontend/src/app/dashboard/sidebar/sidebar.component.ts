import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

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
}
