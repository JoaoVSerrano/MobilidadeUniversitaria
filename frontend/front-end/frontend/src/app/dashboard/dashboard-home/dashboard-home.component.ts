import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { StatCard, Trip, DailyDemand, RouteOccupancy } from '../models/dashboard.model';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { DataTableComponent } from '../data-table/data-table.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [StatCardComponent, DataTableComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  stats: StatCard[] = [];
  trips: Trip[] = [];
  dailyDemand: DailyDemand[] = [];
  routeOccupancy: RouteOccupancy[] = [];

  svgPath: string = '';
  svgPoints: { x: number; y: number; day: string; value: number }[] = [];
  maxDemand: number = 300;

  ngOnInit() {
    this.dashboardService.getStats().subscribe(data => this.stats = data);
    this.dashboardService.getTrips().subscribe(data => this.trips = data);
    this.dashboardService.getDailyDemand().subscribe(data => {
      this.dailyDemand = data;
      this.calculateSvgChart();
    });
    this.dashboardService.getRouteOccupancy().subscribe(data => this.routeOccupancy = data);
  }

  calculateSvgChart() {
    if (this.dailyDemand.length === 0) return;
    
    const width = 500;
    const height = 150;
    const paddingLeft = 30;
    const paddingRight = 30;
    const paddingTop = 20;
    const paddingBottom = 20;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    this.svgPoints = this.dailyDemand.map((item, index) => {
      const x = paddingLeft + (index / (this.dailyDemand.length - 1)) * chartWidth;
      const y = height - paddingBottom - (item.students / this.maxDemand) * chartHeight;
      return { x, y, day: item.day, value: item.students };
    });

    this.svgPath = this.svgPoints.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      } else {
        return `${path} L ${point.x} ${point.y}`;
      }
    }, '');
  }

  getFillPath(): string {
    if (this.svgPoints.length === 0) return '';
    const height = 150;
    const paddingBottom = 20;
    const first = this.svgPoints[0];
    const last = this.svgPoints[this.svgPoints.length - 1];
    
    return `${this.svgPath} L ${last.x} ${height - paddingBottom} L ${first.x} ${height - paddingBottom} Z`;
  }
}
