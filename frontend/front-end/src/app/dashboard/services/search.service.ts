import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  getSearchQuery(): string {
    return this.searchQuerySubject.value;
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }
}
