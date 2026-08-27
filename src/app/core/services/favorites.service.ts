import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorites';
  private favoritesSubject = new BehaviorSubject<number[]>(this.loadFavoritesFromStorage());
  public favorites$: Observable<number[]> = this.favoritesSubject.asObservable();

  private loadFavoritesFromStorage(): number[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  public getFavoritesList(): number[] {
    return this.favoritesSubject.getValue();
  }

  public isFavorite(id: number): boolean {
    return this.getFavoritesList().includes(id);
  }

  public toggleFavorite(id: number): void {
    const currentFavorites = this.getFavoritesList();
    let updatedFavorites: number[];

    if (currentFavorites.includes(id)) {
      updatedFavorites = currentFavorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...currentFavorites, id];
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFavorites));
    this.favoritesSubject.next(updatedFavorites);
  }
}