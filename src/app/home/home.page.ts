import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
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
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner
  ],
})
export class HomePage implements OnInit {
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  public pokemons: PokemonListItem[] = [];
  public offset = 0;
  public limit = 20;
  public isLoading = false;

  constructor() {
    addIcons({ star, starOutline });
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
        this.offset += this.limit;
        this.isLoading = false;

        if (event) {
          event.target.complete();
        }

        // Força o Angular a renderizar a tela imediatamente com os novos Pokémons
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar pokémons:', err);
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
        this.cdr.detectChanges();
      }
    });
  }

  toggleFavorite(event: Event, id?: number) {
    event.stopPropagation();
    event.preventDefault();
    if (id) {
      this.favoritesService.toggleFavorite(id);
    }
  }
}