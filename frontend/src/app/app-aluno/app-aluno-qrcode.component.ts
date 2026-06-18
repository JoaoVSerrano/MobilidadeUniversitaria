import { Component } from '@angular/core';

@Component({
  selector: 'app-aluno-qrcode',
  standalone: true,
  imports: [],
  templateUrl: './app-aluno-qrcode.component.html',
  styleUrl: './app-aluno-qrcode.component.css'
})
export class AppAlunoQrcodeComponent {
  qrCodeData = {
    nome: 'Aluno Teste',
    curso: 'Engenharia de Software',
    validade: '31/12/2026',
    codigo: 'ALU123456'
  };

  // In a real app, this would be a base64 image or a URL to a QR code image
  qrCodeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}