package com.synapse.mobilidadeUniversitaria.Controllers;

import com.synapse.mobilidadeUniversitaria.Entities.Documento;
import com.synapse.mobilidadeUniversitaria.Services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService service;

    @GetMapping
    public ResponseEntity<List<Documento>> listar() {
        return ResponseEntity.ok(service.listarDocumentos());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {
        List<Documento> docs = service.listarDocumentos();
        Map<String, Long> stats = new java.util.LinkedHashMap<>();
        stats.put("totalDocumentos", (long) docs.size());
        stats.put("pendentes", docs.stream().filter(d -> d.getStatus() == Documento.DocumentoStatus.PENDENTE).count());
        stats.put("validados", docs.stream().filter(d -> d.getStatus() == Documento.DocumentoStatus.VALIDADO).count());
        stats.put("expirados", docs.stream().filter(d -> d.getStatus() == Documento.DocumentoStatus.EXPIRADO).count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Documento> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Documento> upload(@RequestParam("file") MultipartFile file,
                                            @RequestParam("nome") String nome,
                                            @RequestParam("tipo") String tipo) throws IOException {
        return ResponseEntity.status(201).body(service.uploadDocumento(file, nome, tipo));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        Documento doc = service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));

        Path path = Paths.get(doc.getCaminhoArquivo());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getNome() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarDocumento(id);
        return ResponseEntity.noContent().build();
    }
}