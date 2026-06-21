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
    this.loadDashboardData();

    // Atualização automática a cada 30 segundos para refletir presenças em tempo real
    setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  loadDashboardData() {
    // KPIs
    this.dashboardService.getStats().subscribe((kpi: any) => {
      this.stats = [
        {
          title: 'Total de Alunos',
          value: (kpi.totalAlunos ?? 0).toString(),
          trend: `+${kpi.variacaoAlunos ?? 0}%`,
          trendDirection: 'up',
          icon: 'users'
        },
        {
          title: 'Taxa de Ocupação',
          value: `${kpi.taxaOcupacao ?? 0}%`,
          trend: `+${kpi.variacaoOcupacao ?? 0}%`,
          trendDirection: 'up',
          icon: 'chart'
        },
        {
          title: 'Viagens Hoje',
          value: (kpi.viagensHoje ?? 0).toString(),
          info: `${kpi.viagensFinalizadas ?? 0} finalizadas`,
          icon: 'clock'
        },
        {
          title: 'Economia Estimada',
          value: `R$ ${(kpi.economiaEstimada ?? 0).toLocaleString('pt-BR')}`,
          icon: 'dashboard'
        }
      ];
    });

    // Viagens
    this.dashboardService.getTrips().subscribe(data => this.trips = data);

    // Demanda diária — a API retorna { dia, totalPresencas }
    this.dashboardService.getDailyDemand().subscribe((data: any[]) => {
      this.dailyDemand = data.map(d => ({
        day: d.dia ?? d.day ?? '',
        students: d.totalPresencas ?? d.students ?? 0
      }));
      this.calculateSvgChart();
    });

    // Ocupação por rota — a API retorna { nomeRota, ocupacaoPercent }
    this.dashboardService.getRouteOccupancy().subscribe((data: any[]) => {
      this.routeOccupancy = data.map(r => ({
        route: r.nomeRota ?? r.route ?? '',
        occupancy: r.ocupacaoPercent ?? r.occupancy ?? 0
      }));
    });
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
