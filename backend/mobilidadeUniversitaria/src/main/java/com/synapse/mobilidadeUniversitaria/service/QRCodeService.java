package com.synapse.mobilidadeUniversitaria.service;

import com.synapse.mobilidadeUniversitaria.dtos.response.QRCodeResponseDTO;
import com.synapse.mobilidadeUniversitaria.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;

@Service
public class QRCodeService {

    private static final String ALGORITHM = "HmacSHA256";
    private static final ZoneId ZONE_ID = ZoneId.systemDefault();

    private final String secret;

    public QRCodeService(@Value("${app_qrcode_secret:mobilidade-universitaria-dev-secret}") String secret) {
        this.secret = secret;
    }

    public QRCodeResponseDTO gerarParaViagem(Long viagemId) {
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
        long expiresEpoch = expiresAt.atZone(ZONE_ID).toEpochSecond();
        String payload = viagemId + ":" + expiresEpoch;
        String signature = assinar(payload);
        String qrData = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString((payload + ":" + signature).getBytes(StandardCharsets.UTF_8));

        return new QRCodeResponseDTO(viagemId, qrData, expiresAt);
    }

    public Long validarEExtrairViagemId(String qrData) {
        try {
            String decoded = new String(Base64.getUrlDecoder().decode(qrData), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":");
            if (parts.length != 3) {
                throw new BadRequestException("QR Code invalido");
            }

            String payload = parts[0] + ":" + parts[1];
            String expectedSignature = assinar(payload);
            if (!expectedSignature.equals(parts[2])) {
                throw new BadRequestException("QR Code invalido");
            }

            long expiresEpoch = Long.parseLong(parts[1]);
            long nowEpoch = LocalDateTime.now().atZone(ZONE_ID).toEpochSecond();
            if (nowEpoch > expiresEpoch) {
                throw new BadRequestException("QR Code expirado");
            }

            return Long.parseLong(parts[0]);
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("QR Code invalido");
        }
    }

    private String assinar(String payload) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), ALGORITHM));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Nao foi possivel assinar o QR Code", ex);
        }
    }
}
