import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserAccount {
  id: number;
  name: string;
  role: string;
  initials: string;
  type: 'gestor' | 'aluno' | 'motorista';
}

@Injectable({
  providedIn: 'root'
})
export class ActiveUserService {
  private accounts: UserAccount[] = [
    { id: 1, name: 'Admin Gestor', role: 'Administrador', initials: 'AG', type: 'gestor' },
    { id: 2, name: 'João Silva', role: 'Aluno', initials: 'JS', type: 'aluno' },
    { id: 3, name: 'Maria Santos', role: 'Motorista', initials: 'MS', type: 'motorista' }
  ];

  private currentUserSubject = new BehaviorSubject<UserAccount>(this.accounts[0]);
  currentUser$ = this.currentUserSubject.asObservable();

  getAccounts(): UserAccount[] {
    return this.accounts;
  }

  getCurrentUser(): UserAccount {
    return this.currentUserSubject.value;
  }

  setCurrentUser(account: UserAccount) {
    this.currentUserSubject.next(account);
  }
}
