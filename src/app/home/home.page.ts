import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, 
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonButtons,
  IonInfiniteScroll, IonInfiniteScrollContent
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
    IonInfiniteScrollContent
  ]
})
export class HomePage implements OnInit {
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  public pokemons: PokemonListItem[] = [];
  public filteredPokemons: PokemonListItem[] = [];
  public searchTerm: string = '';
  private offset = 0;
  private limit = 20;

  constructor() {
    // Registra explicitamente os ícones de coração
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe({
      next: (res) => {
        const newPokemons = res.results.map((item) => {
          const urlParts = item.url.split('/').filter(Boolean);
          const id = parseInt(urlParts[urlParts.length - 1], 10);
          return { ...item, id };
        });

        this.pokemons = [...this.pokemons, ...newPokemons];
        this.filterPokemons();
        this.offset += this.limit;

        if (event) {
          event.target.complete();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar lista:', err);
        if (event) {
          event.target.complete();
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadMore(event: any) {
    this.loadPokemons(event);
  }

  onSearchChange(event: any) {
    this.filterPokemons();
  }

  filterPokemons() {
    if (!this.searchTerm.trim()) {
      this.filteredPokemons = [...this.pokemons];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredPokemons = this.pokemons.filter(
        (p) => p.name.toLowerCase().includes(term) || (p.id && p.id.toString() === term)
      );
    }
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