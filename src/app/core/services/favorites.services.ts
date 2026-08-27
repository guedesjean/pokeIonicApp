import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'poke_app_favorites';
  private favoritesSubject = new BehaviorSubject<number[]>(this.getStoredFavorites());

  public favorites$: Observable<number[]> = this.favoritesSubject.asObservable();

  private getStoredFavorites(): number[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  toggleFavorite(pokemonId: number): void {
    const current = this.favoritesSubject.value;
    const exists = current.includes(pokemonId);
    const updated = exists
      ? current.filter((id) => id !== pokemonId)
      : [...current, pokemonId];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    this.favoritesSubject.next(updated);
  }

  isFavorite(pokemonId: number): boolean {
    return this.favoritesSubject.value.includes(pokemonId);
  }
}