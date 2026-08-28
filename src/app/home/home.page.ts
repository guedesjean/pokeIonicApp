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
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonButtons,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner
  ]
})
export class HomePage implements OnInit {
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  // Lista da paginação na tela
  public pokemons: PokemonListItem[] = [];
  public filteredPokemons: PokemonListItem[] = [];
  
  // Banco completo vindo da PokéAPI para buscas
  private allApiPokemons: PokemonListItem[] = [];

  public searchTerm: string = '';
  public isSearching: boolean = false;
  public isLoadingSearch: boolean = false;

  private offset = 0;
  private limit = 20;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.loadPaginatedPokemons();
    this.fetchAllPokemonsFromApi();
  }

  
  loadPaginatedPokemons(event?: any) {
    if (this.isSearching) {
      if (event) event.target.complete();
      return;
    }

    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe({
      next: (res) => {
        const newItems = res.results.map((item) => {
          const parts = item.url.split('/').filter(Boolean);
          const id = parseInt(parts[parts.length - 1], 10);
          return { name: item.name, url: item.url, id };
        });

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
      error: (err) => {
        console.error('Erro ao carregar Pokémons da API:', err);
        if (event) event.target.complete();
        this.cdr.detectChanges();
      }
    });
  }

  private fetchAllPokemonsFromApi() {
    this.pokemonService.getPokemonList(0, 10000).subscribe({
      next: (res) => {
        this.allApiPokemons = res.results.map((item) => {
          const parts = item.url.split('/').filter(Boolean);
          const id = parseInt(parts[parts.length - 1], 10);
          return { name: item.name, url: item.url, id };
        });
      },
      error: (err) => {
        console.error('Erro ao carregar índice da PokéAPI:', err);
      }
    });
  }

  loadMore(event: any) {
    this.loadPaginatedPokemons(event);
  }

  // 3. Executado ao clicar no botão "Buscar" ou dar Enter
  onSearchSubmit() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.onSearchClear();
      return;
    }

    this.isSearching = true;
    this.isLoadingSearch = true;
    this.cdr.detectChanges();

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
          error: (err) => {
            console.error('Erro ao consultar PokéAPI:', err);
            this.filteredPokemons = [];
            this.isLoadingSearch = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  private executeFilter(term: string) {
    const source = this.allApiPokemons.length > 0 ? this.allApiPokemons : this.pokemons;

    this.filteredPokemons = source.filter((pokemon) => {
      const nameMatch = pokemon.name ? pokemon.name.toLowerCase().includes(term) : false;
      const idMatch = pokemon.id ? pokemon.id.toString() === term : false;
      return nameMatch || idMatch;
    });
  }

  // Limpa a busca e volta para a lista paginada
  onSearchClear() {
    this.searchTerm = '';
    this.isSearching = false;
    this.isLoadingSearch = false;
    this.filteredPokemons = [...this.pokemons];
    this.cdr.detectChanges();
  }

  isFavorite(id?: number): boolean {
    if (!id) return false;
    return this.favoritesService.isFavorite(id);
  }

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