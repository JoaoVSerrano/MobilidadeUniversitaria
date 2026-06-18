import { inject, Injectable } from '@angular/core';
import { Veiculo } from './veiculo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Veiculos {

  readonly httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/veiculos`;

  public getAll(): Observable<Veiculo[]> {
    return this.httpClient.get<Veiculo[]>(this.apiUrl)
  }
  
}
