import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import {
  ReportMetrics,
  TripsOccupancy,
  AttendanceByUniversity,
  ScheduleDistribution,
  RoutePerformance,
  ReportInsight
} from './report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private api = inject(ApiService);

  getMetrics(inicio?: string, fim?: string): Observable<ReportMetrics> {
    let path = '/relatorios/metricas';
    const params: string[] = [];
    if (inicio) params.push(`inicio=${encodeURIComponent(inicio)}`);
    if (fim) params.push(`fim=${encodeURIComponent(fim)}`);
    if (params.length > 0) {
      path += `?${params.join('&')}`;
    }
    return this.api.get<ReportMetrics>(path);
  }

  getTripsAndOccupancy(): Observable<TripsOccupancy[]> {
    return this.api.get<TripsOccupancy[]>('/relatorios/viagens-ocupacao');
  }

  getAttendanceByUniversity(): Observable<AttendanceByUniversity[]> {
    return this.api.get<AttendanceByUniversity[]>('/relatorios/presenca-faculdade');
  }

  getScheduleDistribution(periodo: string = 'todos'): Observable<ScheduleDistribution[]> {
    return this.api.get<ScheduleDistribution[]>(`/relatorios/distribuicao-horarios?periodo=${periodo}`);
  }

  getRoutePerformance(): Observable<RoutePerformance[]> {
    return this.api.get<RoutePerformance[]>('/relatorios/performance-rotas');
  }

  getInsights(): Observable<ReportInsight[]> {
    return this.api.get<ReportInsight[]>('/relatorios/insights');
  }
}
