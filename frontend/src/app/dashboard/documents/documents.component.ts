import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Document } from '../models/dashboard.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  private svc = inject(DashboardService);

  documents: Document[] = [];
  total = 0;
  contracts = 0;
  licenses = 0;
  reports = 0;

  ngOnInit() {
    this.svc.getDocuments().subscribe(data => {
      this.documents = data;
      this.total = data.length;
      this.contracts = data.filter(d => d.type === 'Contrato').length;
      this.licenses = data.filter(d => d.type === 'Licença').length;
      this.reports = data.filter(d => d.type === 'Relatório').length;
    });
  }

  getDocumentIcon(type: Document['type']): string {
    return type; // used as CSS class selector
  }
}
