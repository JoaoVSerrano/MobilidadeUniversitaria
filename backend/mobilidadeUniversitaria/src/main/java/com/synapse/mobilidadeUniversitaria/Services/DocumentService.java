package com.synapse.mobilidadeUniversitaria.Services;

import com.synapse.mobilidadeUniversitaria.Entities.Documento;
import com.synapse.mobilidadeUniversitaria.Repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository repository;
    private final FileStorageService fileStorageService;

    public List<Documento> listarDocumentos() {
        return repository.findAll();
    }

    public Documento uploadDocumento(MultipartFile file, String nome, String tipo) throws IOException {
        String caminho = fileStorageService.storeFile(file);
        Documento doc = Documento.builder()
                .nome(nome)
                .tipo(tipo)
                .caminhoArquivo(caminho)
                .status(Documento.DocumentoStatus.PENDENTE)
                .build();
        return repository.save(doc);
    }

    public void deletarDocumento(Long id) {
        repository.deleteById(id);
    }
}
