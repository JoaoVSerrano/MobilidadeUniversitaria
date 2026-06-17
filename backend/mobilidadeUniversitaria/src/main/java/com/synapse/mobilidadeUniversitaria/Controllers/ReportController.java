package com.synapse.mobilidadeUniversitaria.Controllers;

import com.synapse.mobilidadeUniversitaria.Services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService service;

    @GetMapping("/kpis")
    public ResponseEntity<?> getKpis(@RequestParam String startDate, @RequestParam String endDate, @RequestParam(required = false) String route) {
        return ResponseEntity.ok("Report KPIs endpoint - implementation pending");
    }

    @GetMapping("/trips-occupancy-by-month")
    public ResponseEntity<?> getOccupancyByMonth(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok("Occupancy by month endpoint - implementation pending");
    }

    @GetMapping("/attendance-by-faculty")
    public ResponseEntity<?> getAttendanceByFaculty(@RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok("Attendance by faculty endpoint - implementation pending");
    }

    @GetMapping("/time-distribution")
    public ResponseEntity<?> getTimeDistribution(@RequestParam String period) {
        return ResponseEntity.ok("Time distribution endpoint - implementation pending");
    }

    @GetMapping("/routes-performance")
    public ResponseEntity<?> getRoutesPerformance(@RequestParam(required = false) String route, @RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok("Routes performance endpoint - implementation pending");
    }

    @PostMapping("/export")
    public ResponseEntity<?> exportReport(@RequestBody Object request) {
        return ResponseEntity.ok("Export endpoint - implementation pending");
    }
}
