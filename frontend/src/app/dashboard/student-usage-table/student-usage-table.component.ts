import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentUsageRow } from '../models/dashboard.model';

@Component({
  selector: 'dashboard-student-usage-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-usage-table.component.html',
  styleUrl: './student-usage-table.component.css'
})
export class StudentUsageTableComponent {
  @Input({ required: true }) rows: StudentUsageRow[] = [];
}
