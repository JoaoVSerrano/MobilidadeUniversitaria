import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string;
  @Input() trend?: string;
  @Input() trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() info?: string;
  @Input({ required: true }) icon!: string;
}
