package com.synapse.mobilidadeUniversitaria.mapper;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.dtos.request.EnderecoRequestDTO;
import com.synapse.mobilidadeUniversitaria.dtos.response.EnderecoResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class EnderecoMapper {


    public Endereco toEntity(EnderecoRequestDTO request) {
        if (request == null) return null;

        Endereco endereco = new Endereco();
        endereco.setCep(request.cep());
        endereco.setRua(request.rua());
        endereco.setBairro(request.bairro());
        endereco.setNumero(request.numero());
        endereco.setComplemento(request.complemento());
        endereco.setTipoLocal(request.tipoLocal());

        return endereco;
    }

    public void updateEntity(Endereco endereco, EnderecoRequestDTO request) {
        if (endereco == null || request == null) return;

        endereco.setCep(request.cep());
        endereco.setRua(request.rua());
        endereco.setBairro(request.bairro());
        endereco.setNumero(request.numero());
        endereco.setComplemento(request.complemento());
        endereco.setTipoLocal(request.tipoLocal());
    }

    public EnderecoResponseDTO toResponse(Endereco endereco) {
        if (endereco == null) return null;

        return new EnderecoResponseDTO(
                endereco.getId(),
                endereco.getCep(),
                endereco.getBairro(),
                endereco.getRua(),
                endereco.getNumero(),
                endereco.getComplemento(),
                endereco.getDataHoraValidacao(),
                endereco.getTipoLocal()
        );
    }
}
