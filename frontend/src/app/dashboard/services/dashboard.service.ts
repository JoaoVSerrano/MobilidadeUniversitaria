import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StatCard, User, Route, Vehicle, Trip, Document, DailyDemand, RouteOccupancy } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public getStats(): Observable<StatCard[]> {
    return of([
      {
        title: 'Total de Alunos',
        value: '1.284',
        trend: '+12%',
        trendDirection: 'up',
        info: 'vs. mês anterior',
        icon: 'users'
      },
      {
        title: 'Taxa de Ocupação',
        value: '82%',
        trend: '+5%',
        trendDirection: 'up',
        info: 'vs. semana anterior',
        icon: 'percentage'
      },
      {
        title: 'Viagens Hoje',
        value: '48',
        trend: '8',
        trendDirection: 'neutral',
        info: 'finalizadas',
        icon: 'bus'
      },
      {
        title: 'Economia Estimada',
        value: 'R$ 84k',
        trend: 'Este mês',
        trendDirection: 'neutral',
        info: '',
        icon: 'wallet'
      }
    ]);
  }

  public getUsers(): Observable<User[]> {
    return of([
      { id: 1, name: 'João Silva', cpf: '123.456.789-00', email: 'joao@email.com', phone: '(11) 98765-4321', type: 'aluno', status: 'Ativo', createdAt: '14/01/2024' },
      { id: 2, name: 'Maria Santos', cpf: '234.567.890-11', email: 'maria@email.com', phone: '(11) 98765-5678', type: 'motorista', status: 'Ativo', createdAt: '19/06/2023' },
      { id: 3, name: 'Pedro Costa', cpf: '345.678.901-22', email: 'pedro@email.com', phone: '(11) 98765-8765', type: 'motorista', status: 'Ativo', createdAt: '09/08/2023' },
      { id: 4, name: 'Ana Oliveira', cpf: '456.789.012-33', email: 'ana@email.com', phone: '(11) 98765-1111', type: 'aluno', status: 'Ativo', createdAt: '31/01/2024' },
      { id: 5, name: 'Carlos Souza', cpf: '567.890.123-44', email: 'carlos@email.com', phone: '(11) 98765-2222', type: 'aluno', status: 'Pendente', createdAt: '14/03/2024' }
    ]);
  }

  public getRoutes(): Observable<Route[]> {
    return of([
      {
        id: 1,
        name: 'Centro-Campus',
        description: 'Rota principal do centro até o campus',
        originDest: 'Terminal Central → Campus Universitário',
        distance: '12.5 km',
        time: '35 min',
        capacity: 45,
        status: 'Ativa',
        stops: [
          { name: 'Terminal Central', time: '07:00' },
          { name: 'Praça da República', time: '07:10' },
          { name: 'Shopping Center', time: '07:20' }
        ]
      },
      {
        id: 2,
        name: 'Bairro A-Campus',
        description: 'Rota do Bairro A até o campus',
        originDest: 'Bairro A → Campus Universitário',
        distance: '8.3 km',
        time: '25 min',
        capacity: 40,
        status: 'Ativa',
        stops: [
          { name: 'Bairro A', time: '07:15' },
          { name: 'Mercado Municipal', time: '07:25' },
          { name: 'Campus Universitário', time: '07:40' }
        ]
      }
    ]);
  }

  public getVehicles(): Observable<Vehicle[]> {
    return of([
      { id: 1, code: 'BUS-001', plate: 'ABC-1234', model: 'Mercedes-Benz OF-1721', year: 2020, status: 'ativo', capacity: 45, mileage: '125k', nextRevision: '14/06/2026' },
      { id: 2, code: 'BUS-002', plate: 'DEF-5678', model: 'Volvo B270F', year: 2021, status: 'ativo', capacity: 40, mileage: '98k', nextRevision: '19/07/2026' },
      { id: 3, code: 'BUS-003', plate: 'GHI-9012', model: 'Scania K270', year: 2019, status: 'manutencao', capacity: 42, mileage: '156k', nextRevision: '31/05/2026' },
      { id: 4, code: 'BUS-004', plate: 'JKL-3456', model: 'Mercedes-Benz OF-1721', year: 2022, status: 'ativo', capacity: 45, mileage: '45k', nextRevision: '10/08/2026' },
      { id: 5, code: 'BUS-005', plate: 'MNO-7890', model: 'Volvo B270F', year: 2023, status: 'ativo', capacity: 50, mileage: '28k', nextRevision: '22/11/2026' }
    ]);
  }

  public getTrips(): Observable<Trip[]> {
    return of([
      { id: 1, route: 'Centro-Campus', date: '11/05/2026', time: '07:30', driver: 'João Silva', vehicle: 'BUS-001', studentsCount: 38, status: 'agendada' },
      { id: 2, route: 'Bairro A-Campus', date: '11/05/2026', time: '07:45', driver: 'Maria Santos', vehicle: 'BUS-002', studentsCount: 29, status: 'agendada' },
      { id: 3, route: 'Centro-Campus', date: '10/05/2026', time: '07:30', driver: 'João Silva', vehicle: 'BUS-001', studentsCount: 42, status: 'concluida' }
    ]);
  }

  public getDocuments(): Observable<Document[]> {
    return of([
      { id: 1, name: 'Contrato Motorista - João Silva.pdf', type: 'Contrato', size: '2.4 MB', date: '14/01/2024' },
      { id: 2, name: 'Licença Veículo BUS-001.pdf', type: 'Licença', size: '1.8 MB', date: '19/02/2024' },
      { id: 3, name: 'Seguro Frota 2024.pdf', type: 'Seguro', size: '5.1 MB', date: '04/01/2024' },
      { id: 4, name: 'Relatório Mensal Abril.xlsx', type: 'Relatório', size: '892 KB', date: '30/04/2024' }
    ]);
  }

  public getDailyDemand(): Observable<DailyDemand[]> {
    return of([
      { day: 'Seg', students: 180 },
      { day: 'Ter', students: 240 },
      { day: 'Qua', students: 290 },
      { day: 'Qui', students: 210 },
      { day: 'Sex', students: 260 },
      { day: 'Sáb', students: 70 },
      { day: 'Dom', students: 30 }
    ]);
  }

  public getRouteOccupancy(): Observable<RouteOccupancy[]> {
    return of([
      { route: 'Centro-Campus', occupancy: 88 },
      { route: 'Bairro A-Campus', occupancy: 72 },
      { route: 'Bairro B-Campus', occupancy: 95 },
      { route: 'Bairro C-Campus', occupancy: 60 },
      { route: 'Terminal-Campus', occupancy: 82 }
    ]);
  }
}
