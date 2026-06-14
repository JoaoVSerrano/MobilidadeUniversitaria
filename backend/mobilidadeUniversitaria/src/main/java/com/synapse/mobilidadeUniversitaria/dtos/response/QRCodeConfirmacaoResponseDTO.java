package com.synapse.mobilidadeUniversitaria.dtos.response;

public record QRCodeConfirmacaoResponseDTO(
        boolean valido,
        Long alunoId,
        String alunoNome,
        Long viagemId,
        String mensagem,
        PresencaDigitalResponseDTO presenca
) {
}
