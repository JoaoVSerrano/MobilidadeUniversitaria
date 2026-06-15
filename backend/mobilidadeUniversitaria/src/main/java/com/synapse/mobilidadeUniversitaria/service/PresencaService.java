package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.enums.PresencaStatus;
import com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus;
import com.synapse.mobilidadeUniversitaria.dtos.request.QRCodeConfirmacaoRequestDTO;
import com.synapse.mobilidadeUniversitaria.Entities.Aluno;
import com.synapse.mobilidadeUniversitaria.Entities.PresencaDigital;
import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.dtos.request.PresencaRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeConfirmacaoResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.OcupacaoViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.PresencaDigitalResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.BadRequestException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceAlreadyExistsException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.PresencaDigitalRepository;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import com.synapse.mobilidadeUniversitaria.security.AuthorizationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PresencaService {

    private final PresencaDigitalRepository presencaRepository;
    private final AlunoRepository alunoRepository;
    private final ViagemRepository viagemRepository;
    private final QRCodeService qrCodeService;
    private final AuthorizationService authorizationService;

    public PresencaService(PresencaDigitalRepository presencaRepository,
                           AlunoRepository alunoRepository,
                           ViagemRepository viagemRepository,
                           QRCodeService qrCodeService,
                           AuthorizationService authorizationService) {
        this.presencaRepository = presencaRepository;
        this.alunoRepository = alunoRepository;
        this.viagemRepository = viagemRepository;
        this.qrCodeService = qrCodeService;
        this.authorizationService = authorizationService;
    }

    public PresencaDigitalResponseDTO registrar(PresencaRequestDTO dto) {
        return registrar(dto.alunoId(), dto.viagemId());
    }

    public PresencaDigitalResponseDTO reservarParaAlunoLogado(Long viagemId) {
        return registrar(authorizationService.currentUser().getId(), viagemId);
    }

    private PresencaDigitalResponseDTO registrar(Long alunoId, Long viagemId) {
        if (presencaRepository.findByAlunoIdAndViagemId(alunoId, viagemId).isPresent()) {
            throw new ResourceAlreadyExistsException("Aluno ja possui reserva de presenca nesta viagem");
        }

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + alunoId));
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + viagemId));

        validarViagemPodeReceberReserva(viagem);

        PresencaDigital presenca = new PresencaDigital();
        presenca.setAluno(aluno);
        presenca.setViagem(viagem);

        return toResponse(presencaRepository.save(presenca));
    }

    public QRCodeConfirmacaoResponseDTO confirmarPorQRCode(QRCodeConfirmacaoRequestDTO dto) {
        return confirmarPorQRCode(dto.alunoId(), dto.qrData());
    }

    public QRCodeConfirmacaoResponseDTO confirmarPorQRCodeDoAlunoLogado(String qrData) {
        Long alunoId = authorizationService.currentUser().getId();
        return confirmarPorQRCode(alunoId, qrData);
    }

    private QRCodeConfirmacaoResponseDTO confirmarPorQRCode(Long alunoId, String qrData) {
        Long viagemId = qrCodeService.validarEExtrairViagemId(qrData);

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado com id: " + alunoId));

        PresencaDigital presenca = presencaRepository.findByAlunoIdAndViagemId(alunoId, viagemId)
                .orElseThrow(() -> new BadRequestException("Aluno nao possui reserva de presenca para esta viagem"));

        validarViagemPodeConfirmarPresenca(presenca.getViagem());

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

    public List<PresencaDigitalResponseDTO> listarDoAlunoLogado() {
        return listarPorAluno(authorizationService.currentUser().getId());
    }

    public OcupacaoViagemResponseDTO ocupacaoDaViagem(Long viagemId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + viagemId));

        List<PresencaDigital> presencas = presencaRepository.findByViagemId(viagemId);
        long reservas = presencas.stream()
                .filter(presenca -> !PresencaStatus.CANCELADA.equals(presenca.getStatus()))
                .count();
        long confirmados = presencas.stream()
                .filter(presenca -> PresencaStatus.CONFIRMADA.equals(presenca.getStatus()))
                .count();
        int capacidade = viagem.getVeiculo() == null ? 0 : viagem.getVeiculo().getCapacidadeTotal();
        double percentual = capacidade == 0 ? 0 : (confirmados * 100.0) / capacidade;

        return new OcupacaoViagemResponseDTO(viagemId, capacidade, reservas, confirmados, percentual);
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

    private void validarViagemPodeReceberReserva(Viagem viagem) {
        if (!ViagemStatus.AGENDADA.equals(viagem.getStatus())) {
            throw new BadRequestException("Apenas viagens agendadas aceitam reserva de presenca");
        }

        if (!LocalDateTime.now().isBefore(viagem.getDataHoraPartida())) {
            throw new BadRequestException("Nao e possivel reservar presenca apos o inicio da viagem");
        }

        int capacidade = viagem.getVeiculo() == null ? 0 : viagem.getVeiculo().getCapacidadeTotal();
        long reservasAtivas = presencaRepository.countByViagemIdAndStatusNot(viagem.getId(), PresencaStatus.CANCELADA);
        if (capacidade > 0 && reservasAtivas >= capacidade) {
            throw new BadRequestException("Viagem sem vagas disponiveis");
        }
    }

    private void validarViagemPodeConfirmarPresenca(Viagem viagem) {
        if (ViagemStatus.CANCELADA.equals(viagem.getStatus()) || ViagemStatus.FINALIZADA.equals(viagem.getStatus())) {
            throw new BadRequestException("Nao e possivel confirmar presenca em viagem cancelada ou finalizada");
        }
    }
}
