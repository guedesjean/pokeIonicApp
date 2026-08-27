import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { PokemonService } from '../../core/services/pokemon.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { PokemonDetail } from '../../core/models/pokemon.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol
  ],
})
export class DetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  public pokemon: PokemonDetail | null = null;
  public isLoading = true;
  public errorMessage = '';

  constructor() {
    addIcons({ star, starOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPokemonDetail(id);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Pokémon não encontrado.';
      this.cdr.detectChanges();
    }
  }

  loadPokemonDetail(id: string) {
    this.isLoading = true;
    this.pokemonService.getPokemonDetail(id).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar detalhes do Pokémon.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  toggleFavorite() {
    if (this.pokemon) {
      this.favoritesService.toggleFavorite(this.pokemon.id);
      this.cdr.detectChanges();
    }
  }

  getTypes(): string {
    return this.pokemon?.types.map((t) => t.type.name).join(', ') || '';
  }

  getAbilities(): string {
    return this.pokemon?.abilities.map((a) => a.ability.name).join(', ') || '';
  }

  getMoves(): string {
    return this.pokemon?.moves.slice(0, 5).map((m) => m.move.name).join(', ') || '';
  }
}