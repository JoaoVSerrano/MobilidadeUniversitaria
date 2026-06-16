import { inject, Injectable } from '@angular/core';
import { Veiculo } from './veiculo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Veiculos {

  readonly httpClient = inject(HttpClient);

  public getAll(): Observable<Veiculo[]> {
    return this.httpClient.get<Veiculo[]>('http://localhost:8080/veiculos')
  }
  
}

const veiculosService = new Veiculos();
veiculosService.getAll().subscribe(veiculos => {
  console.log(veiculos);
  console.log(veiculos[0]);
  console.log(veiculos[0].marca);
});
