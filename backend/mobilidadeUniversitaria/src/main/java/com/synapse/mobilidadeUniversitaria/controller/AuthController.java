package com.synapse.mobilidadeUniversitaria.controller;

import com.synapse.mobilidadeUniversitaria.dtos.request.LoginRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.RegisterGestorRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.RegisterSimplificadoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.request.StudentRegistrationRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.JwtResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.UsuarioResponseDTO;
import com.synapse.mobilidadeUniversitaria.service.AuthService;
import com.synapse.mobilidadeUniversitaria.service.CreateUserService;
import com.synapse.mobilidadeUniversitaria.service.StudentRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CreateUserService createUserService;
    private final StudentRegistrationService studentRegistrationService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> register(@Valid @RequestBody RegisterGestorRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrarPrimeiroGestor(dto));
    }

    @PostMapping("/register/user")
    public ResponseEntity<UsuarioResponseDTO> registerUser(@Valid @RequestBody RegisterSimplificadoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(createUserService.criar(dto));
    }

    @PostMapping("/register/student-request")
    public ResponseEntity<com.synapse.mobilidadeUniversitaria.dtos.response.StudentRequestResponseDTO> registerStudentRequest(@Valid @RequestBody StudentRegistrationRequestDTO dto) {
        studentRegistrationService.createStudentRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new com.synapse.mobilidadeUniversitaria.dtos.response.StudentRequestResponseDTO(
                true,
                "Solicitação de cadastro enviada com sucesso",
                java.time.LocalDateTime.now(),
                "Seu pedido foi encaminhado ao gestor. Você será notificado via email assim que sua conta for aprovada."
        ));
    }

    @GetMapping("/student-requests")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<List<?>> listStudentRequests() {
        return ResponseEntity.ok(studentRegistrationService.listPendingRequests());
    }

    @PostMapping("/student-requests/{id}/approve")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<UsuarioResponseDTO> approveStudentRequest(@PathVariable Long id) {
        return ResponseEntity.ok(studentRegistrationService.approveStudentRequest(id));
    }

    @PostMapping("/student-requests/{id}/reject")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<Void> rejectStudentRequest(@PathVariable Long id) {
        studentRegistrationService.rejectStudentRequest(id);
        return ResponseEntity.noContent().build();
    }
}