import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { AppAlunoComponent } from '../app-aluno/app-aluno.component';
import { AppMotoristaComponent } from '../app-motorista/app-motorista.component';
import { ActiveUserService } from '../services/active-user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, AppAlunoComponent, AppMotoristaComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private activeUserSvc = inject(ActiveUserService);
  
  sidebarOpen: boolean = false;
  currentView: 'gestor' | 'aluno' | 'motorista' = 'gestor';
  private sub = new Subscription();

  ngOnInit() {
    this.sub.add(
      this.activeUserSvc.currentUser$.subscribe(user => {
        this.currentView = user.type;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
