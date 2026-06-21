import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  /**
   * Generates a Base64 DataURL for a given string.
   * @param data The string to encode into a QR Code.
   * @returns Promise with the Base64 image string.
   */
  async generateQrCode(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
      throw err;
    }
  }
}
