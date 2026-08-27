import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PokemonDetail, PokemonListResponse } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        map((response) => ({
          ...response,
          results: response.results.map((item) => {
            const id = this.extractIdFromUrl(item.url);
            return {
              ...item,
              id,
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            };
          }),
        })),
        catchError(this.handleError)
      );
  }

  getPokemonDetail(idOrName: string | number): Observable<PokemonDetail> {
    return this.http
      .get<PokemonDetail>(`${this.baseUrl}/pokemon/${idOrName}`)
      .pipe(catchError(this.handleError));
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.trim().split('/').filter(Boolean);
    return parseInt(parts[parts.length - 1], 10);
  }

  private handleError(error: unknown) {
    console.error('Erro na requisição à PokéAPI:', error);
    return throwError(() => new Error('Falha ao carregar dados da PokéAPI. Tente novamente.'));
  }
}