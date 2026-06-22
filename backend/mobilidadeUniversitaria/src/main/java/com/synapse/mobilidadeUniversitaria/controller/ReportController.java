package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.response.*;
import com.synapse.mobilidadeUniversitaria.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GESTOR')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/metricas")
    public ResponseEntity<ReportMetricsDTO> getDashboardMetrics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(reportService.getDashboardMetrics(inicio, fim));
    }

    @GetMapping("/viagens-ocupacao")
    public ResponseEntity<List<TripsOccupancyDTO>> getTripsAndOccupancy() {
        return ResponseEntity.ok(reportService.getTripsAndOccupancy());
    }

    @GetMapping("/presenca-faculdade")
    public ResponseEntity<List<AttendanceByUniversityDTO>> getAttendanceByUniversity() {
        return ResponseEntity.ok(reportService.getAttendanceByUniversity());
    }

    @GetMapping("/distribuicao-horarios")
    public ResponseEntity<List<ScheduleDistributionDTO>> getScheduleDistribution(
            @RequestParam(required = false, defaultValue = "todos") String periodo) {
        return ResponseEntity.ok(reportService.getScheduleDistribution(periodo));
    }

    @GetMapping("/performance-rotas")
    public ResponseEntity<List<RoutePerformanceDTO>> getRoutePerformance() {
        return ResponseEntity.ok(reportService.getRoutePerformance());
    }

    @GetMapping("/insights")
    public ResponseEntity<List<ReportInsightDTO>> getInsights() {
        return ResponseEntity.ok(reportService.getInsights());
    }
}
