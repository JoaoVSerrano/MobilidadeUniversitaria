package com.synapse.mobilidadeUniversitaria.dtos.response;

import com.synapse.mobilidadeUniversitaria.Entities.Endereco;
import com.synapse.mobilidadeUniversitaria.Entities.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public abstract class UsuarioResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private UserType tipoUsuario;
    private String telefone;
    private EnderecoResponseDTO endereco;
}
