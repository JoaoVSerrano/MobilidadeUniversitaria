package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.enums.PresencaStatus;
import com.synapse.mobilidadeUniversitaria.dtos.request.QRCodeConfirmacaoRequestDTO;
import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.Entities.PresencaDigital;
import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.dtos.request.PresencaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeConfirmacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.PresencaDigitalResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.BadRequestException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceAlreadyExistsException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.PresencaDigitalRepository;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PresencaService {

    private final PresencaDigitalRepository presencaRepository;
    private final AlunoRepository alunoRepository;
    private final ViagemRepository viagemRepository;
    private final QRCodeService qrCodeService;

    public PresencaService(PresencaDigitalRepository presencaRepository,
                           AlunoRepository alunoRepository,
                           ViagemRepository viagemRepository,
                           QRCodeService qrCodeService) {
        this.presencaRepository = presencaRepository;
        this.alunoRepository = alunoRepository;
        this.viagemRepository = viagemRepository;
        this.qrCodeService = qrCodeService;
    }

    public PresencaDigitalResponseDTO registrar(PresencaRequestDTO dto) {
        if (presencaRepository.findByAlunoIdAndViagemId(dto.alunoId(), dto.viagemId()).isPresent()) {
            throw new ResourceAlreadyExistsException("Aluno ja possui reserva de presenca nesta viagem");
        }

        Aluno aluno = alunoRepository.findById(dto.alunoId())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + dto.alunoId()));
        Viagem viagem = viagemRepository.findById(dto.viagemId())
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + dto.viagemId()));

        PresencaDigital presenca = new PresencaDigital();
        presenca.setAluno(aluno);
        presenca.setViagem(viagem);

        return toResponse(presencaRepository.save(presenca));
    }

    public QRCodeConfirmacaoResponseDTO confirmarPorQRCode(QRCodeConfirmacaoRequestDTO dto) {
        Long viagemId = qrCodeService.validarEExtrairViagemId(dto.qrData());

        Aluno aluno = alunoRepository.findById(dto.alunoId())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + dto.alunoId()));

        PresencaDigital presenca = presencaRepository.findByAlunoIdAndViagemId(dto.alunoId(), viagemId)
                .orElseThrow(() -> new BadRequestException("Aluno nao possui reserva de presenca para esta viagem"));

        if (PresencaStatus.CANCELADA.equals(presenca.getStatus())) {
            throw new BadRequestException("Reserva de presenca cancelada");
        }

        if (PresencaStatus.CONFIRMADA.equals(presenca.getStatus())) {
            throw new ResourceAlreadyExistsException("Presenca ja confirmada nesta viagem");
        }

        presenca.setStatus(PresencaStatus.CONFIRMADA);
        presenca.setDataHoraValidacao(LocalDateTime.now());
        PresencaDigital confirmada = presencaRepository.save(presenca);

        return new QRCodeConfirmacaoResponseDTO(
                true,
                aluno.getId(),
                aluno.getNome(),
                viagemId,
                "Presenca confirmada com sucesso",
                toResponse(confirmada)
        );
    }

    public List<PresencaDigitalResponseDTO> listarPorViagem(Long viagemId) {
        return presencaRepository.findByViagemId(viagemId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PresencaDigitalResponseDTO> listarPorAluno(Long alunoId) {
        return presencaRepository.findByAlunoId(alunoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deletar(Long id) {
        PresencaDigital presenca = presencaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presenca nao encontrada com id: " + id));
        presencaRepository.delete(presenca);
    }

    private PresencaDigitalResponseDTO toResponse(PresencaDigital presenca) {
        return new PresencaDigitalResponseDTO(
                presenca.getId(),
                presenca.getAluno().getId(),
                presenca.getAluno().getNome(),
                presenca.getViagem().getId(),
                presenca.getDataHoraReserva(),
                presenca.getDataHoraValidacao(),
                presenca.getStatus()
        );
    }
}
