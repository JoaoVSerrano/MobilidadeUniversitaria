import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-kpi-card',
  standalone: true,
  templateUrl: './dashboard-kpi-card.component.html',
  styleUrl: './dashboard-kpi-card.component.css'
})
export class DashboardKpiCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string;
  @Input() subtitle?: string;
  @Input() trend?: number | null;
  @Input() icon: 'users' | 'trend' | 'calendar' = 'users';
  @Input() color: 'blue' | 'green' | 'purple' = 'blue';

  getTrendLabel(): string {
    if (this.trend === null || this.trend === undefined) return '';
    const sign = this.trend > 0 ? '+' : '';
    return `${sign}${this.trend}%`;
  }

  getTrendClass(): string {
    if (this.trend === null || this.trend === undefined) return 'neutral';
    if (this.trend > 0) return 'positive';
    if (this.trend < 0) return 'negative';
    return 'neutral';
  }
}
