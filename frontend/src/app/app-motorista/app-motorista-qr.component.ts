import { Component } from '@angular/core';

@Component({
  selector: 'app-motorista-qr',
  standalone: true,
  imports: [],
  templateUrl: './app-motorista-qr.component.html',
  styleUrl: './app-motorista-qr.component.css'
})
export class AppMotoristaQrComponent {
  qrCodeData = {
    nome: 'Motorista Teste',
    cnh: '1234567890',
    validade: '31/12/2028',
    codigo: 'MOT123456'
  };

  // In a real app, this would be a base64 image or a URL to a QR code image
  qrCodeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}