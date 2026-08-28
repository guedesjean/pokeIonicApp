import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonButtons, IonBackButton,
  IonButton, IonIcon, IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { PokemonService } from '../../core/services/pokemon.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { PokemonDetail } from '../../core/models/pokemon.model';
import { forkJoin, Observable } from 'rxjs';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonButtons, IonBackButton, IonButton, IonIcon, IonSpinner
  ]
})
export class FavoritesPage implements OnInit {
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  // Lista dos salvos
  public favoritePokemons: PokemonDetail[] = [];
  public isLoading = true;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.loadFavorites();
  }

  // Recarrega sempre que entrar na tela
  ionViewWillEnter() {
    this.loadFavorites();
  }

  // Busca as informações dos Pokémons salvos
  loadFavorites() {
    const favoriteIds: number[] = this.favoritesService.getFavoritesList();
    if (!favoriteIds || favoriteIds.length === 0) {
      this.favoritePokemons = [];
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    const requests: Observable<PokemonDetail>[] = favoriteIds.map((id: number) => 
      this.pokemonService.getPokemonDetail(id.toString())
    );

    forkJoin(requests).subscribe({
      next: (pokemons: PokemonDetail[]) => {
        this.favoritePokemons = pokemons;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar favoritos:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Remove dos favoritos
  removeFavorite(event: Event, id: number) {
    event.stopPropagation();
    event.preventDefault();
    this.favoritesService.toggleFavorite(id);
    this.favoritePokemons = this.favoritePokemons.filter(p => p.id !== id);
    this.cdr.detectChanges();
  }
}