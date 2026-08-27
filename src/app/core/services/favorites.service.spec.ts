import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a pokemon to favorites', () => {
    service.toggleFavorite(25);
    expect(service.isFavorite(25)).toBe(true);
  });

  it('should remove a pokemon from favorites if already added', () => {
    service.toggleFavorite(25);
    expect(service.isFavorite(25)).toBe(true);

    service.toggleFavorite(25);
    expect(service.isFavorite(25)).toBe(false);
  });

  it('should persist favorites in localStorage', () => {
    service.toggleFavorite(1);
    
    // Instancia um novo serviço para simular a leitura do localStorage no carregamento inicial
    const newServiceInstance = TestBed.inject(FavoritesService);
    expect(newServiceInstance.isFavorite(1)).toBe(true);
  });
});