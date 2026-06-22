import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  menuItems: SidebarItem[] = [
    { name: 'Dashboard',     icon: 'dashboard', route: '/dashboard'              },
    { name: 'Relatórios',    icon: 'chart',     route: '/dashboard/relatorios'   },
    { name: 'Usuários',      icon: 'users',     route: '/dashboard/usuarios'     },
    { name: 'Rotas',         icon: 'route',     route: '/dashboard/rotas'        },
    { name: 'Veículos',      icon: 'bus',       route: '/dashboard/veiculos'     },
    { name: 'Viagens',       icon: 'clock',     route: '/dashboard/viagens'      },
    { name: 'Documentos',    icon: 'file',      route: '/dashboard/documentos'   },
    { name: 'Notificações',  icon: 'bell',      route: '/dashboard/notificacoes' },
    { name: 'Configurações', icon: 'settings',  route: '/dashboard/configuracoes'}
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
