export interface ReportMetrics {
  totalViagens: number;
  variacaoViagens: number;
  ocupacaoMedia: number;
  variacaoOcupacao: number;
  pontualidade: number;
  alunosAtivos: number;
  alunosPendentes: number;
  veiculosAtivos: number;
  veiculosTotal: number;
  veiculosManutencao: number;
}

export interface TripsOccupancy {
  mes: string;
  totalViagens: number;
  ocupacaoPercent: number;
}

export interface AttendanceByUniversity {
  faculdade: string;
  totalAlunos: number;
  presentes: number;
}

export interface ScheduleDistribution {
  faixaHoraria: string;
  quantidade: number;
  percentual: number;
}

export interface RoutePerformance {
  rotaId: number;
  nomeRota: string;
  totalViagens: number;
  mediaOcupacao: number;
  alunosTransportados: number;
  statusPerformance: 'Ótimo' | 'Regular' | 'Baixo';
}

export interface ReportInsight {
  tipo: 'success' | 'warning' | 'info' | 'danger';
  icone: string;
  titulo: string;
  descricao: string;
}
