package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.Entities.Motorista;
import com.synapse.mobilidadeUniversitaria.Entities.Rota;
import com.synapse.mobilidadeUniversitaria.Entities.Veiculo;
import com.synapse.mobilidadeUniversitaria.Entities.Viagem;
import com.synapse.mobilidadeUniversitaria.Entities.enums.ViagemStatus;
import com.synapse.mobilidadeUniversitaria.dtos.request.ViagemRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemStatsResponseDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.ViagemResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.BadRequestException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceAlreadyExistsException;
import com.synapse.mobilidadeUniversitaria.exceptions.ResourceNotFoundException;
import com.synapse.mobilidadeUniversitaria.mapper.ViagemMapper;
import com.synapse.mobilidadeUniversitaria.repositories.MotoristaRepository;
import com.synapse.mobilidadeUniversitaria.repositories.RotaRepository;
import com.synapse.mobilidadeUniversitaria.repositories.VeiculoRepository;
import com.synapse.mobilidadeUniversitaria.repositories.ViagemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ViagemService {

    private final ViagemRepository viagemRepository;
    private final MotoristaRepository motoristaRepository;
    private final VeiculoRepository veiculoRepository;
    private final RotaRepository rotaRepository;
    private final ViagemMapper viagemMapper;
    private final QRCodeService qrCodeService;
    private final com.synapse.mobilidadeUniversitaria.repositories.NotificacaoRepository notificacaoRepository;
    private final com.synapse.mobilidadeUniversitaria.repositories.NotificacaoMotoristaRepository notificacaoMotoristaRepository;
    private final com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository alunoRepository;

    public ViagemService(ViagemRepository viagemRepository,
                         MotoristaRepository motoristaRepository,
                         VeiculoRepository veiculoRepository,
                         RotaRepository rotaRepository,
                         ViagemMapper viagemMapper,
                         QRCodeService qrCodeService,
                         com.synapse.mobilidadeUniversitaria.repositories.NotificacaoRepository notificacaoRepository,
                         com.synapse.mobilidadeUniversitaria.repositories.NotificacaoMotoristaRepository notificacaoMotoristaRepository,
                         com.synapse.mobilidadeUniversitaria.repositories.AlunoRepository alunoRepository) {
        this.viagemRepository = viagemRepository;
        this.motoristaRepository = motoristaRepository;
        this.veiculoRepository = veiculoRepository;
        this.rotaRepository = rotaRepository;
        this.viagemMapper = viagemMapper;
        this.qrCodeService = qrCodeService;
        this.notificacaoRepository = notificacaoRepository;
        this.notificacaoMotoristaRepository = notificacaoMotoristaRepository;
        this.alunoRepository = alunoRepository;
    }

    public ViagemResponseDTO criar(ViagemRequestDTO dto) {
        Motorista motorista = motoristaRepository.findById(dto.motoristaId())
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + dto.motoristaId()));

        Veiculo veiculo = veiculoRepository.findById(dto.veiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado com id: " + dto.veiculoId()));

        Rota rota = rotaRepository.findById(dto.rotaId())
                .orElseThrow(() -> new ResourceNotFoundException("Rota nao encontrada com id: " + dto.rotaId()));

        validarConflitos(dto, null);

        Viagem viagem = new Viagem();
        viagem.setDataHoraPartida(dto.dataHoraPartida());
        viagem.setDataHoraChegadaPrevista(dto.dataHoraChegadaPrevista());
        viagem.setStatus(ViagemStatus.AGENDADA);
        viagem.setMotorista(motorista);
        viagem.setVeiculo(veiculo);
        viagem.setRota(rota);

        Viagem salva = viagemRepository.save(viagem);

        // Notificar todos os alunos ativos sobre a nova viagem
        try {
            List<com.synapse.mobilidadeUniversitaria.Entities.Aluno> alunos = alunoRepository.findAll();
            for (com.synapse.mobilidadeUniversitaria.Entities.Aluno aluno : alunos) {
                com.synapse.mobilidadeUniversitaria.Entities.Notificacao notif =
                        new com.synapse.mobilidadeUniversitaria.Entities.Notificacao();
                notif.setAluno(aluno);
                notif.setViagem(salva);
                notif.setTipoNotificacao("NOVA_VIAGEM");
                notif.setMensagem(
                    "Nova viagem disponível: " + salva.getRota().getNomeRota() +
                    " em " + salva.getDataHoraPartida().toLocalDate() +
                    " às " + salva.getDataHoraPartida().toLocalTime().toString().substring(0, 5) +
                    ". Faça sua reserva!"
                );
                notif.setLida(false);
                notificacaoRepository.save(notif);
            }
        } catch (Exception e) {
            // Não impede a criação da viagem se as notificações falharem
        }

        // Notificar o motorista designado
        try {
            com.synapse.mobilidadeUniversitaria.Entities.NotificacaoMotorista notifMot =
                    new com.synapse.mobilidadeUniversitaria.Entities.NotificacaoMotorista();
            notifMot.setMotorista(motorista);
            notifMot.setViagem(salva);
            notifMot.setTipoNotificacao("VIAGEM_DESIGNADA");
            notifMot.setMensagem(
                "Você foi designado para a viagem: " + salva.getRota().getNomeRota() +
                " em " + salva.getDataHoraPartida().toLocalDate() +
                " às " + salva.getDataHoraPartida().toLocalTime().toString().substring(0, 5)
            );
            notifMot.setLida(false);
            notificacaoMotoristaRepository.save(notifMot);
        } catch (Exception e) {
            // Não impede a criação da viagem
        }

        return viagemMapper.toResponse(salva);
    }

    public ViagemResponseDTO buscarPorId(Long id) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));
        return viagemMapper.toResponse(viagem);
    }

    public List<ViagemResponseDTO> listarTodos() {
        return viagemRepository.findAll()
                .stream()
                .map(viagemMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ViagemResponseDTO> listarPorMotorista(Long motoristaId) {
        return viagemRepository.findByMotoristaId(motoristaId)
                .stream()
                .map(viagemMapper::toResponse)
                .toList();
    }

    public List<ViagemResponseDTO> listarHojePorMotorista(Long motoristaId) {
        LocalDate hoje = LocalDate.now();
        return viagemRepository.findByMotoristaId(motoristaId)
                .stream()
                .filter(viagem -> !viagem.getDataHoraPartida().isBefore(hoje.atStartOfDay())
                        && viagem.getDataHoraPartida().isBefore(hoje.plusDays(1).atStartOfDay()))
                .map(viagemMapper::toResponse)
                .toList();
    }

    public List<ViagemResponseDTO> listarHoje() {
        LocalDate hoje = LocalDate.now();
        return viagemRepository.findByDataHoraPartidaBetween(hoje.atStartOfDay(), hoje.plusDays(1).atStartOfDay())
                .stream()
                .map(viagemMapper::toResponse)
                .toList();
    }

    public List<ViagemResponseDTO> listarProximas() {
        return viagemRepository.findByDataHoraPartidaAfterOrderByDataHoraPartidaAsc(LocalDateTime.now())
                .stream()
                .map(viagemMapper::toResponse)
                .toList();
    }

    public ViagemStatsResponseDTO estatisticas() {
        return new ViagemStatsResponseDTO(
                viagemRepository.count(),
                listarHoje().size(),
                listarProximas().size()
        );
    }

    public QRCodeResponseDTO gerarQRCode(Long viagemId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + viagemId));
        validarViagemPodeGerarQRCode(viagem);
        return qrCodeService.gerarParaViagem(viagemId);
    }

    public ViagemResponseDTO atualizar(Long id, ViagemRequestDTO dto) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));

        Motorista motorista = motoristaRepository.findById(dto.motoristaId())
                .orElseThrow(() -> new ResourceNotFoundException("Motorista nao encontrado com id: " + dto.motoristaId()));

        Veiculo veiculo = veiculoRepository.findById(dto.veiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado com id: " + dto.veiculoId()));

        Rota rota = rotaRepository.findById(dto.rotaId())
                .orElseThrow(() -> new ResourceNotFoundException("Rota nao encontrada com id: " + dto.rotaId()));

        if (!ViagemStatus.AGENDADA.equals(viagem.getStatus())) {
            throw new BadRequestException("Apenas viagens agendadas podem ser atualizadas");
        }

        validarConflitos(dto, id);

        viagem.setDataHoraPartida(dto.dataHoraPartida());
        viagem.setDataHoraChegadaPrevista(dto.dataHoraChegadaPrevista());
        viagem.setMotorista(motorista);
        viagem.setVeiculo(veiculo);
        viagem.setRota(rota);

        Viagem atualizada = viagemRepository.save(viagem);

        // Notificar o motorista sobre a atualização da viagem
        try {
            com.synapse.mobilidadeUniversitaria.Entities.NotificacaoMotorista notifMot =
                    new com.synapse.mobilidadeUniversitaria.Entities.NotificacaoMotorista();
            notifMot.setMotorista(motorista);
            notifMot.setViagem(atualizada);
            notifMot.setTipoNotificacao("VIAGEM_ATUALIZADA");
            notifMot.setMensagem(
                "Sua viagem foi atualizada: " + atualizada.getRota().getNomeRota() +
                " em " + atualizada.getDataHoraPartida().toLocalDate() +
                " às " + atualizada.getDataHoraPartida().toLocalTime().toString().substring(0, 5)
            );
            notifMot.setLida(false);
            notificacaoMotoristaRepository.save(notifMot);
        } catch (Exception e) {
            // Não impede a atualização da viagem
        }

        return viagemMapper.toResponse(atualizada);
    }

    public void deletar(Long id) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));
        if (ViagemStatus.FINALIZADA.equals(viagem.getStatus())) {
            throw new BadRequestException("Viagem finalizada nao pode ser cancelada");
        }

        // Deletar notificações associadas à viagem
        try {
            notificacaoRepository.deleteByViagemId(id);
        } catch (Exception e) {
            // Não impede a exclusão da viagem se falhar ao deletar notificações
        }

        // Deletar notificações de motorista associadas à viagem
        try {
            notificacaoMotoristaRepository.deleteByViagemId(id);
        } catch (Exception e) {
            // Não impede a exclusão da viagem se falhar ao deletar notificações
        }

        viagemRepository.delete(viagem);
    }

    public ViagemResponseDTO iniciar(Long id) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));
        if (!ViagemStatus.AGENDADA.equals(viagem.getStatus())) {
            throw new BadRequestException("Apenas viagens agendadas podem ser iniciadas");
        }
        viagem.setStatus(ViagemStatus.EM_ANDAMENTO);
        viagem.setDataHoraInicio(LocalDateTime.now());
        return viagemMapper.toResponse(viagemRepository.save(viagem));
    }

    public ViagemResponseDTO finalizar(Long id) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem nao encontrada com id: " + id));
        if (!ViagemStatus.EM_ANDAMENTO.equals(viagem.getStatus())) {
            throw new BadRequestException("Apenas viagens em andamento podem ser finalizadas");
        }
        viagem.setStatus(ViagemStatus.FINALIZADA);
        viagem.setDataHoraChegadaReal(LocalDateTime.now());
        return viagemMapper.toResponse(viagemRepository.save(viagem));
    }

    private void validarConflitos(ViagemRequestDTO dto, Long ignorarId) {
        if (viagemRepository.countConflitosMotorista(
                dto.motoristaId(),
                dto.dataHoraPartida(),
                dto.dataHoraChegadaPrevista(),
                ignorarId
        ) > 0) {
            throw new ResourceAlreadyExistsException("Motorista ja possui viagem no mesmo periodo");
        }

        if (viagemRepository.countConflitosVeiculo(
                dto.veiculoId(),
                dto.dataHoraPartida(),
                dto.dataHoraChegadaPrevista(),
                ignorarId
        ) > 0) {
            throw new ResourceAlreadyExistsException("Veiculo ja possui viagem no mesmo periodo");
        }
    }

    private void validarViagemPodeGerarQRCode(Viagem viagem) {
        if (ViagemStatus.CANCELADA.equals(viagem.getStatus()) || ViagemStatus.FINALIZADA.equals(viagem.getStatus())) {
            throw new BadRequestException("QR Code nao pode ser gerado para viagem cancelada ou finalizada");
        }

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime inicioJanela = viagem.getDataHoraPartida().minusMinutes(30);
        LocalDateTime fimJanela = viagem.getDataHoraChegadaPrevista().plusMinutes(30);
        if (agora.isBefore(inicioJanela) || agora.isAfter(fimJanela)) {
            throw new BadRequestException("QR Code so pode ser gerado proximo ao horario da viagem");
        }
    }
}
