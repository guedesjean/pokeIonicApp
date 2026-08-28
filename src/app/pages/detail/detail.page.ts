import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSpinner
} from '@ionic/angular';
import { PokemonService } from '../../core/services/pokemon.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { PokemonDetail } from '../../core/models/pokemon.model';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonSpinner
  ]
})
export class DetailPage implements OnInit {
  // Pega a rota atual para saber qual ID foi passado no clique
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  public favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  // Guarda os dados completos do Pokémon carregado
  public pokemon?: PokemonDetail;
  public isLoading = true;

  // Dicionário de tradução dos tipos (Inglês -> Português)
  private typeTranslations: { [key: string]: string } = {
    bug: 'Inseto',
    dark: 'Sombrio',
    dragon: 'Dragão',
    electric: 'Elétrico',
    fairy: 'Fada',
    fighting: 'Lutador',
    fire: 'Fogo',
    flying: 'Voador',
    ghost: 'Fantasma',
    grass: 'Planta',
    ground: 'Terrestre',
    ice: 'Gelo',
    normal: 'Normal',
    poison: 'Venenoso',
    psychic: 'Psíquico',
    rock: 'Pedra',
    steel: 'Aço',
    water: 'Água'
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPokemonDetail(id);
    }
  }

  loadPokemonDetail(id: string) {
    this.isLoading = true;
    this.pokemonService.getPokemonDetail(id).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTypePt(typeName: string): string {
    return this.typeTranslations[typeName.toLowerCase()] || typeName;
  }
}