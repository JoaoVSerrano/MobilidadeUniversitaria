import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private alunoTabSource = new Subject<'home' | 'reservas' | 'qrcode' | 'notificacoes' | 'perfil'>();
  alunoTab$ = this.alunoTabSource.asObservable();

  setAlunoTab(tab: 'home' | 'reservas' | 'qrcode' | 'notificacoes' | 'perfil') {
    this.alunoTabSource.next(tab);
  }
}
