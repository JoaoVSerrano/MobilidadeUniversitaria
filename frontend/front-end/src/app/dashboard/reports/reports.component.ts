import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DailyDemand, Document, Route, RouteOccupancy, Trip, Vehicle } from '../models/dashboard.model';

interface MetricCard {
  title: string;
  value: string;
  note: string;
  tone: 'blue' | 'cyan' | 'yellow' | 'violet' | 'orange';
}

interface RouteReportRow {
  route: string;
  trips: number;
  occupancy: number;
  students: number;
  status: 'Ótimo' | 'Regular' | 'Atenção';
  statusClass: 'status-otimo' | 'status-regular' | 'status-atencao';
}

interface ChartPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  private svc = inject(DashboardService);

  documents: Document[] = [];
  trips: Trip[] = [];
  routes: Route[] = [];
  vehicles: Vehicle[] = [];
  dailyDemand: DailyDemand[] = [];
  routeOccupancy: RouteOccupancy[] = [];

  totalTrips = 0;
  totalStudents = 0;
  averageOccupancy = 0;
  punctuality = 0;
  activeFleet = 0;
  fleetTotal = 0;

  demandLabels: string[] = [];
  demandValues: number[] = [];
  demandPoints: ChartPoint[] = [];
  occupancyLabels: string[] = [];
  occupancyValues: number[] = [];
  occupancyPoints: ChartPoint[] = [];
  occupancyColors: string[] = [];
  routePerformance: RouteReportRow[] = [];

  metrics: MetricCard[] = [];

  ngOnInit() {
    this.svc.getDocuments().subscribe(data => {
      this.documents = data;
    });

    this.svc.getTrips().subscribe(data => {
      this.trips = data;
      this.totalTrips = data.length;
      this.totalStudents = data.reduce((sum, trip) => sum + trip.studentsCount, 0);
      this.punctuality = this.totalTrips === 0 ? 0 : Math.round((data.filter(trip => trip.status === 'concluida' || trip.status === 'completed').length / this.totalTrips) * 100);
      this.buildPerformanceTable();
      this.buildMetrics();
    });

    this.svc.getRoutes().subscribe(data => {
      this.routes = data;
      this.buildPerformanceTable();
    });

    this.svc.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.fleetTotal = data.length;
      this.activeFleet = data.filter(v => v.status === 'ativo').length;
      this.buildMetrics();
    });

    this.svc.getDailyDemand().subscribe(data => {
      this.dailyDemand = data;
      this.demandLabels = data.map(point => point.day);
      this.demandValues = data.map(point => point.students);
      this.demandPoints = this.buildPoints(this.demandValues, 460, 150, 30, 20, 130);
    });

    this.svc.getRouteOccupancy().subscribe(data => {
      this.routeOccupancy = data;
      this.averageOccupancy = data.length === 0 ? 0 : Math.round(data.reduce((sum, item) => sum + item.occupancy, 0) / data.length);
      this.occupancyLabels = data.map(item => item.route);
      this.occupancyValues = data.map(item => item.occupancy);
      this.occupancyPoints = this.buildPoints(this.occupancyValues, 460, 150, 30, 20, 130);
      this.occupancyColors = data.map((_, index) => ['#3b82f6', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]);
      this.buildPerformanceTable();
      this.buildMetrics();
    });
  }

  get demandSvgPath(): string {
    return this.buildSvgPath(this.demandValues, 460, 150, 30, 20, 130);
  }

  get demandFillPath(): string {
    const stroke = this.buildSvgPath(this.demandValues, 460, 150, 30, 20, 130);
    if (!stroke) return '';
    return `${stroke} L 470 130 L 30 130 Z`;
  }

  get occupancySvgPath(): string {
    return this.buildSvgPath(this.occupancyValues, 460, 150, 30, 20, 130);
  }

  get occupancyFillPath(): string {
    const stroke = this.buildSvgPath(this.occupancyValues, 460, 150, 30, 20, 130);
    if (!stroke) return '';
    return `${stroke} L 470 130 L 30 130 Z`;
  }

  get occupancyLegend(): Array<{ label: string; value: number; color: string }> {
    return this.occupancyLabels.map((label, index) => ({
      label,
      value: this.occupancyValues[index] ?? 0,
      color: this.occupancyColors[index] ?? '#3b82f6'
    }));
  }

  get periodDistribution(): Array<{ label: string; value: number; color: string }> {
    const blocks = [
      { label: '06:00-08:00', value: 35, color: '#3b82f6' },
      { label: '08:00-10:00', value: 25, color: '#10b981' },
      { label: '10:00-12:00', value: 15, color: '#f59e0b' },
      { label: '12:00-14:00', value: 10, color: '#ef4444' },
      { label: '14:00-16:00', value: 8, color: '#8b5cf6' },
      { label: '16:00-18:00', value: 7, color: '#ec4899' }
    ];

    return blocks;
  }

  get periodConicGradient(): string {
    const blocks = this.periodDistribution;
    let cursor = 0;
    return blocks.map(block => {
      const start = cursor;
      cursor += block.value;
      return `${block.color} ${start}% ${cursor}%`;
    }).join(', ');
  }

  get monthlyLabel(): string {
    return 'Jan Jun';
  }

  exportReport() {
    window.print();
  }

  trackByLabel(_: number, item: { label: string }) {
    return item.label;
  }

  private buildMetrics() {
    this.metrics = [
      {
        title: 'Total Viagens',
        value: this.totalTrips.toLocaleString('pt-BR'),
        note: '+8.2% vs. período anterior',
        tone: 'blue'
      },
      {
        title: 'Ocupação Média',
        value: `${this.averageOccupancy}%`,
        note: '+3.1% vs. período anterior',
        tone: 'cyan'
      },
      {
        title: 'Pontualidade',
        value: `${this.punctuality}%`,
        note: '+2.4% vs. período anterior',
        tone: 'yellow'
      },
      {
        title: 'Alunos Ativos',
        value: this.totalStudents.toLocaleString('pt-BR'),
        note: `${Math.max(this.totalStudents - 120, 0)} pendentes`,
        tone: 'violet'
      },
      {
        title: 'Frota Ativa',
        value: `${this.activeFleet}/${this.fleetTotal}`,
        note: `${Math.max(this.fleetTotal - this.activeFleet, 0)} em manutenção`,
        tone: 'orange'
      }
    ];
  }

  private buildPerformanceTable() {
    const routes = this.routes.length > 0 ? this.routes : [];
    this.routePerformance = routes.map(route => {
      const tripCount = this.trips.filter(trip => trip.route === route.name).length;
      const trips = tripCount > 0 ? tripCount : 120 + (route.name.length * 7) % 80;
      const occupancyItem = this.routeOccupancy.find(item => item.route === route.name);
      const occupancy = occupancyItem?.occupancy ?? 70;
      const students = Math.floor((trips * occupancy) / 10);
      return {
        route: route.name,
        trips,
        occupancy,
        students,
        status: occupancy >= 85 ? 'Ótimo' : occupancy >= 70 ? 'Regular' : 'Atenção',
        statusClass: occupancy >= 85 ? 'status-otimo' : occupancy >= 70 ? 'status-regular' : 'status-atencao'
      };
    });

    if (this.routePerformance.length === 0) {
      this.routePerformance = this.routeOccupancy.map(item => ({
        route: item.route,
        trips: 120 + (item.route.length * 7) % 80,
        occupancy: item.occupancy,
        students: Math.floor(item.occupancy * 18),
        status: item.occupancy >= 85 ? 'Ótimo' : item.occupancy >= 70 ? 'Regular' : 'Atenção',
        statusClass: item.occupancy >= 85 ? 'status-otimo' : item.occupancy >= 70 ? 'status-regular' : 'status-atencao'
      }));
    }
  }

  private buildSvgPath(values: number[], width: number, height: number, left: number, top: number, bottom: number): string {
    if (!values.length) return '';

    const plotWidth = width - left * 2;
    const plotHeight = height - top - bottom;
    const max = Math.max(...values);
    const step = values.length === 1 ? 0 : plotWidth / (values.length - 1);

    return values.map((value, index) => {
      const x = left + index * step;
      const normalized = max === 0 ? 0 : value / max;
      const y = top + (1 - normalized) * plotHeight;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  }

  private buildPoints(values: number[], width: number, height: number, left: number, top: number, bottom: number): ChartPoint[] {
    if (!values.length) return [];

    const plotWidth = width - left * 2;
    const plotHeight = height - top - bottom;
    const max = Math.max(...values);
    const step = values.length === 1 ? 0 : plotWidth / (values.length - 1);

    return values.map((value, index) => {
      const x = left + index * step;
      const normalized = max === 0 ? 0 : value / max;
      const y = top + (1 - normalized) * plotHeight;
      return { x, y };
    });
  }
}
