import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonButton, IonIcon,
  IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonButtons
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline, heart } from 'ionicons/icons';
import { PokemonService } from '../core/services/pokemon.service';
import { FavoritesService } from '../core/services/favorites.service';
import { PokemonListItem } from '../core/models/pokemon.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonButton,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonButtons
  ],
})
export class HomePage implements OnInit {
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  public pokemons: PokemonListItem[] = [];
  public filteredPokemons: PokemonListItem[] = [];
  public offset = 0;
  public limit = 20;
  public isLoading = false;
  public searchTerm = '';

  constructor() {
    addIcons({ star, starOutline, heart });
  }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    if (this.isLoading && !event) return;
    this.isLoading = true;

    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: (response) => {
        this.pokemons = [...this.pokemons, ...response.results];
        this.applyFilter();
        this.offset += this.limit;
        this.isLoading = false;

        if (event) event.target.complete();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar pokémons:', err);
        this.isLoading = false;
        if (event) event.target.complete();
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.detail.value?.toLowerCase() || '';
    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredPokemons = [...this.pokemons];
    } else {
      this.filteredPokemons = this.pokemons.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  isPokemonFavorite(id?: number): boolean {
    return id ? this.favoritesService.isFavorite(id) : false;
  }

  toggleFavorite(event: Event, id?: number) {
    event.stopPropagation();
    event.preventDefault();
    if (id) {
      this.favoritesService.toggleFavorite(id);
      this.cdr.detectChanges();
    }
  }
}