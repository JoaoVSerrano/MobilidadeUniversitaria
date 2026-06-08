export interface StatCard {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  info?: string;
  icon: string;
}

export interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  type: 'aluno' | 'motorista' | 'admin';
  status: 'Ativo' | 'Pendente' | 'Inativo';
  createdAt: string;
}

export interface RouteStop {
  name: string;
  time: string;
}

export interface Route {
  id: number;
  name: string;
  description: string;
  originDest: string;
  distance: string;
  time: string;
  capacity: number;
  status: 'Ativa' | 'Inativa';
  stops: RouteStop[];
}

export interface Vehicle {
  id: number;
  code: string;
  plate: string;
  model: string;
  year: number;
  status: 'ativo' | 'manutencao' | 'inativo';
  capacity: number;
  mileage: string;
  nextRevision: string;
}

export interface Trip {
  id: number;
  route: string;
  date: string;
  time: string;
  driver: string;
  vehicle: string;
  studentsCount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'agendada' | 'concluida';
}

export interface Document {
  id: number;
  name: string;
  type: 'Contrato' | 'Licença' | 'Seguro' | 'Relatório';
  size: string;
  date: string;
}

export interface DailyDemand {
  day: string;
  students: number;
}

export interface RouteOccupancy {
  route: string;
  occupancy: number; // percentage
}
