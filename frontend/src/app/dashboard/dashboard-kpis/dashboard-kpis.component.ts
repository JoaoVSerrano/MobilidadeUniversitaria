import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummary } from '../models/dashboard.model';
import { DashboardKpiCardComponent } from '../dashboard-kpi-card/dashboard-kpi-card.component';

@Component({
  selector: 'dashboard-kpis',
  standalone: true,
  imports: [CommonModule, DashboardKpiCardComponent],
  templateUrl: './dashboard-kpis.component.html',
  styleUrl: './dashboard-kpis.component.css'
})
export class DashboardKpisComponent {
  @Input() summary: DashboardSummary | null = null;
}
