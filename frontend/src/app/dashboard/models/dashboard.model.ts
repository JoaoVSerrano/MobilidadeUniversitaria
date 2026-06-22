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
  address?: {
    cep: string;
    rua: string;
    bairro: string;
    numero: string;
    complemento?: string;
    tipoLocal?: string;
  };
  faculdade?: {
    id: number;
    nome: string;
  };
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
  status: 'Ativa' | 'Inativa';
  stops: RouteStop[];
  paradas?: string[];
  distance?: string;
  time?: string;
  capacity?: number;
}

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  year: number | null;
  status: string;
  capacity: number;
  kmRodados: number | null;
  proximaRevisao: string | null;
}

export interface Trip {
  id: number;
  route: string;
  routeId?: number;
  date: string;
  time: string;
  driver: string;
  driverId?: number;
  vehicle: string;
  vehicleId?: number;
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
