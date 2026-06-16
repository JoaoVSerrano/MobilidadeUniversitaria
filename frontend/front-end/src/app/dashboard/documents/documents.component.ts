import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { Document } from '../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit, OnDestroy {
  private svc = inject(DashboardService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  documents: Document[] = [];
  total = 0;
  contracts = 0;
  licenses = 0;
  reports = 0;

  uploadSuccess: string | null = null;

  private sub = new Subscription();

  ngOnInit() {
    this.sub.add(
      this.svc.getDocuments().subscribe(data => {
        this.documents = data;
        this.total = data.length;
        this.contracts = data.filter(d => d.type === 'Contrato').length;
        this.licenses = data.filter(d => d.type === 'Licença').length;
        this.reports = data.filter(d => d.type === 'Relatório').length;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const type = this.classifyByExtension(file.name);
    const size = this.formatSize(file.size);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const date = `${dd}/${mm}/${yyyy}`;

    const doc: Document = {
      id: 0,
      name: file.name,
      type,
      size,
      date
    };

    this.svc.addDocument(doc);

    // Show brief success toast
    this.uploadSuccess = `"${file.name}" enviado com sucesso!`;
    setTimeout(() => { this.uploadSuccess = null; }, 3000);

    // Reset input so same file can be uploaded again if needed
    input.value = '';
  }

  private classifyByExtension(filename: string): Document['type'] {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const spreadsheets = ['xlsx', 'xls', 'csv', 'ods'];
    const reports     = ['pdf', 'docx', 'doc'];
    if (spreadsheets.includes(ext)) return 'Relatório';
    if (filename.toLowerCase().includes('contrat')) return 'Contrato';
    if (filename.toLowerCase().includes('licen'))   return 'Licença';
    if (filename.toLowerCase().includes('segur'))   return 'Seguro';
    if (reports.includes(ext)) return 'Contrato'; // default PDF to Contrato
    return 'Relatório';
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  getDocumentIcon(type: Document['type']): string {
    return type;
  }
}
