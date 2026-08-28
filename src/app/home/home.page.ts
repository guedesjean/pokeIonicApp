import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, 
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonButtons,
  IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { PokemonService } from '../core/services/pokemon.service';
import { FavoritesService } from '../core/services/favorites.service';
import { PokemonListItem } from '../core/models/pokemon.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, 
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonButtons,
    IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner
  ]
})
export class HomePage implements OnInit {
  // Serviços da aplicação
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  // Listas de Pokémons para controlar o que aparece na tela
  public pokemons: PokemonListItem[] = [];
  public filteredPokemons: PokemonListItem[] = [];

  // Controles da busca e da tela
  public searchTerm: string = '';
  public isSearching: boolean = false;
  public isLoadingSearch: boolean = false;

  // Controle de paginação
  private offset = 0;
  private limit = 20;

  constructor() {
    // Carrega os ícones de coração
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    // Carrega a primeira página de Pokémons ao abrir
    this.loadPaginatedPokemons();
  }

  // Carrega os Pokémons de 20 em 20
  loadPaginatedPokemons(event?: any) {
    if (this.isSearching) {
      if (event) event.target.complete();
      return;
    }

    // Busca na API
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe({
      next: (res) => {
        // Trata a lista para pegar o ID de cada Pokémon
        const newItems = res.results.map((item) => {
          const parts = item.url.split('/').filter(Boolean);
          const id = parseInt(parts[parts.length - 1], 10);
          return { name: item.name, url: item.url, id };
        });

        // Junta com a lista antiga sem repetir
        const map = new Map(this.pokemons.map(p => [p.id, p]));
        newItems.forEach(p => map.set(p.id, p));
        this.pokemons = Array.from(map.values());

        if (!this.isSearching) {
          this.filteredPokemons = [...this.pokemons];
        }

        this.offset += this.limit;
        if (event) event.target.complete();
        this.cdr.detectChanges();
      },
      error: () => {
        if (event) event.target.complete();
        this.cdr.detectChanges();
      }
    });
  }

  // Quando o usuário rola a tela até o final
  loadMore(event: any) {
    this.loadPaginatedPokemons(event);
  }

  // Lógica principal de busca
  onSearchSubmit() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.onSearchClear();
      return;
    }

    this.isSearching = true;
    this.isLoadingSearch = true;
    this.cdr.detectChanges();

    // 1. Procura primeiro no que já está na tela
    const localMatches = this.pokemons.filter(pokemon => {
      const nameMatch = pokemon.name ? pokemon.name.toLowerCase().includes(term) : false;
      const idMatch = pokemon.id ? pokemon.id.toString() === term : false;
      return nameMatch || idMatch;
    });

    if (localMatches.length > 0) {
      this.filteredPokemons = localMatches;
      this.isLoadingSearch = false;
      this.cdr.detectChanges();
      return;
    }

    // 2. Se não achou na tela, busca direto na API
    this.pokemonService.getPokemonDetail(term).subscribe({
      next: (data) => {
        this.filteredPokemons = [{
          name: data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
          id: data.id
        }];
        this.isLoadingSearch = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // Se a busca exata falhou, pesquisa em todos os Pokémons da API por trecho
        this.pokemonService.getPokemonList(0, 1200).subscribe({
          next: (res) => {
            const apiMatches = res.results
              .map(item => {
                const parts = item.url.split('/').filter(Boolean);
                const id = parseInt(parts[parts.length - 1], 10);
                return { name: item.name, url: item.url, id };
              })
              .filter(pokemon => {
                const nameMatch = pokemon.name.toLowerCase().includes(term);
                const idMatch = pokemon.id.toString() === term;
                return nameMatch || idMatch;
              });

            this.filteredPokemons = apiMatches;
            this.isLoadingSearch = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.filteredPokemons = [];
            this.isLoadingSearch = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  // Reseta a busca e volta para a lista normal
  onSearchClear() {
    this.searchTerm = '';
    this.isSearching = false;
    this.isLoadingSearch = false;
    this.filteredPokemons = [...this.pokemons];
    this.cdr.detectChanges();
  }

  // Checa se é favorito
  isFavorite(id?: number): boolean {
    if (!id) return false;
    return this.favoritesService.isFavorite(id);
  }

  // Adiciona ou remove dos favoritos
  toggleFavorite(event: Event, pokemon: PokemonListItem) {
    event.stopPropagation();
    event.preventDefault();
    if (pokemon.id) {
      this.favoritesService.toggleFavorite(pokemon.id);
      this.cdr.detectChanges();
    }
  }

  trackByPokemonId(index: number, pokemon: PokemonListItem): number {
    return pokemon.id || index;
  }
}