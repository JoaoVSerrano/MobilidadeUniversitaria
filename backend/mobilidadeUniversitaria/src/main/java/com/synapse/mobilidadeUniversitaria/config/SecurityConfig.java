package com.synapse.mobilidadeUniversitaria.config;

import com.synapse.mobilidadeUniversitaria.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final String allowedOrigins;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          UserDetailsService userDetailsService,
                          @Value("${app.cors.allowed-origins}") String allowedOrigins) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) ->
                                escreverErro(response, request, HttpStatus.UNAUTHORIZED, "Nao autenticado"))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                escreverErro(response, request, HttpStatus.FORBIDDEN, "Acesso negado"))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rotas/**", "/api/routes/**").hasAnyRole("GESTOR", "ALUNO", "MOTORISTA")
                        .requestMatchers(HttpMethod.GET, "/api/viagens/**", "/api/trips/**").hasAnyRole("GESTOR", "ALUNO", "MOTORISTA")
                        .requestMatchers(HttpMethod.GET, "/api/veiculos/**", "/api/vehicles/**").hasRole("GESTOR")
                        .requestMatchers("/api/dashboard/**").hasRole("GESTOR")
                        .requestMatchers("/api/usuarios/**", "/api/users/**").hasRole("GESTOR")
                        .requestMatchers("/api/gestores/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.POST, "/api/alunos", "/api/motoristas").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/alunos/**", "/api/motoristas/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/alunos/**", "/api/motoristas/**").hasAnyRole("GESTOR", "ALUNO", "MOTORISTA")
                        .requestMatchers("/api/enderecos/**", "/api/faculdades/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.POST, "/api/rotas/**", "/api/routes/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/rotas/**", "/api/routes/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/rotas/**", "/api/routes/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.POST, "/api/veiculos/**", "/api/vehicles/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/veiculos/**", "/api/vehicles/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/veiculos/**", "/api/vehicles/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.POST, "/api/viagens/**", "/api/trips/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/viagens/**", "/api/trips/**").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/viagens/**", "/api/trips/**").hasRole("GESTOR")
                        .requestMatchers("/api/presencas/**").hasAnyRole("GESTOR", "ALUNO", "MOTORISTA")
                        .requestMatchers("/api/notificacoes/**").hasAnyRole("GESTOR", "ALUNO", "MOTORISTA")
                        .requestMatchers("/api/student/**").hasRole("ALUNO")
                        .requestMatchers("/api/driver/**").hasRole("MOTORISTA")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private void escreverErro(HttpServletResponse response,
                              HttpServletRequest request,
                              HttpStatus status,
                              String message) throws java.io.IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String body = """
                {"timestamp":"%s","status":%d,"error":"%s","message":"%s","path":"%s","validationErrors":null}
                """.formatted(
                LocalDateTime.now(),
                status.value(),
                escape(status.getReasonPhrase()),
                escape(message),
                escape(request.getRequestURI())
        );
        response.getWriter().write(body);
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
