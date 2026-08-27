import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch pokemon list and transform response with ids and images', () => {
    const dummyResponse = {
      count: 1000,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      ]
    };

    service.getPokemonList(20, 0).subscribe((data) => {
      expect(data.results.length).toBe(1);
      expect(data.results[0].id).toBe(1);
      expect(data.results[0].imageUrl).toContain('1.png');
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});